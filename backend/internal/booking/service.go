// Package booking implements all reservation business logic for HIRABAN.
// Core invariants:
//   - Double bookings are prevented at the database level using GIST exclusion constraints.
//   - Prices are always snapshotted at booking time and never mutated.
//   - Availability is re-checked immediately before payment capture.
//   - All money amounts are in IRR (Tomans), stored as int64.
//   - Payment operations are idempotent via idempotency keys.
package booking

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/hiraban/api/internal/database"
	"github.com/hiraban/api/internal/domain"
	"github.com/jackc/pgx/v5"
)

var (
	ErrUnavailable      = errors.New("accommodation not available for selected dates")
	ErrHoldExpired      = errors.New("booking hold has expired")
	ErrCapacityExceeded = errors.New("guest count exceeds unit capacity")
	ErrMinStay          = errors.New("minimum stay requirement not met")
	ErrPaymentRequired  = errors.New("payment required to confirm reservation")
)

// Service handles reservation lifecycle.
type Service struct {
	db *database.DB
}

func NewService(db *database.DB) *Service {
	return &Service{db: db}
}

// SearchAvailability returns available accommodation types for the requested dates and guests.
// This is the first step of the booking funnel.
func (s *Service) SearchAvailability(ctx context.Context, req SearchRequest) ([]domain.AvailabilityResult, error) {
	nights := int(req.CheckOut.Sub(req.CheckIn).Hours() / 24)
	if nights <= 0 {
		return nil, fmt.Errorf("check-out must be after check-in")
	}
	if nights > 30 {
		return nil, fmt.Errorf("maximum stay is 30 nights")
	}

	pool := s.db.Pool()

	// Query units that have no confirmed reservations and no closed inventory
	// on any day in the requested range.
	rows, err := pool.Query(ctx, `
		SELECT
			at.id          AS type_id,
			au.id          AS unit_id,
			MIN(sr.price_irr) AS price_per_night,
			rp.id          AS plan_id
		FROM accommodation_units au
		JOIN accommodation_types at ON at.id = au.type_id
		JOIN rate_plans rp ON rp.type_id = at.id
		JOIN seasonal_rates sr ON sr.plan_id = rp.id
			AND daterange(sr.date_from, sr.date_to, '[]') && daterange($1::date, $2::date, '[)')
		WHERE au.active = TRUE AND at.active = TRUE AND rp.active = TRUE
		  AND at.max_guests >= $3
		  AND ($4 = FALSE OR at.pool_type != 'none')
		  AND NOT EXISTS (
			SELECT 1 FROM reservations r
			WHERE r.unit_id = au.id
			  AND r.status NOT IN ('cancelled')
			  AND daterange(r.check_in, r.check_out, '[)') && daterange($1::date, $2::date, '[)')
		  )
		  AND NOT EXISTS (
			SELECT 1 FROM inventory inv
			WHERE inv.unit_id = au.id
			  AND inv.closed = TRUE
			  AND inv.date >= $1::date AND inv.date < $2::date
		  )
		  AND NOT EXISTS (
			SELECT 1 FROM booking_holds bh
			WHERE bh.unit_id = au.id
			  AND bh.expires_at > NOW()
			  AND daterange(bh.date_from, bh.date_to, '[)') && daterange($1::date, $2::date, '[)')
		  )
		  AND rp.min_stay_nights <= $5
		GROUP BY at.id, au.id, rp.id
		ORDER BY price_per_night ASC
	`, req.CheckIn, req.CheckOut, req.Adults+req.Children, req.RequirePool, nights)
	if err != nil {
		return nil, fmt.Errorf("availability query: %w", err)
	}
	defer rows.Close()

	var results []domain.AvailabilityResult
	for rows.Next() {
		var r domain.AvailabilityResult
		var pricePerNight int64
		if err := rows.Scan(&r.TypeID, &r.UnitID, &pricePerNight, &r.PlanID); err != nil {
			return nil, err
		}
		r.CheckIn = req.CheckIn
		r.CheckOut = req.CheckOut
		r.Nights = nights
		r.PricePerNight = domain.Money(pricePerNight)
		r.TotalIRR = domain.Money(pricePerNight * int64(nights))
		r.Available = true
		results = append(results, r)
	}
	return results, rows.Err()
}

// CreateHold temporarily reserves a unit for a session while the guest completes checkout.
// The hold automatically expires after HoldDuration.
const HoldDuration = 15 * time.Minute

func (s *Service) CreateHold(ctx context.Context, req HoldRequest) (*Hold, error) {
	pool := s.db.Pool()

	id := uuid.New()
	expiresAt := time.Now().Add(HoldDuration)

	// The GIST exclusion constraint in the DB prevents overlapping holds.
	_, err := pool.Exec(ctx, `
		INSERT INTO booking_holds (id, unit_id, date_from, date_to, session_id, expires_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, id, req.UnitID, req.CheckIn, req.CheckOut, req.SessionID, expiresAt)
	if err != nil {
		// Postgres exclusion constraint violation = overlapping hold
		return nil, ErrUnavailable
	}

	return &Hold{ID: id, ExpiresAt: expiresAt}, nil
}

// ConfirmReservation transitions a hold into a confirmed reservation after successful payment.
// Re-checks availability before committing.
func (s *Service) ConfirmReservation(ctx context.Context, req ConfirmRequest) (*domain.Reservation, error) {
	pool := s.db.Pool()

	tx, err := pool.BeginTx(ctx, pgx.TxOptions{IsoLevel: pgx.Serializable})
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	// 1. Verify the hold is still valid
	var holdExists bool
	err = tx.QueryRow(ctx, `
		SELECT EXISTS(
			SELECT 1 FROM booking_holds
			WHERE id = $1 AND session_id = $2 AND expires_at > NOW()
		)
	`, req.HoldID, req.SessionID).Scan(&holdExists)
	if err != nil || !holdExists {
		return nil, ErrHoldExpired
	}

	// 2. Re-check availability (double-booking prevention)
	var conflict bool
	err = tx.QueryRow(ctx, `
		SELECT EXISTS(
			SELECT 1 FROM reservations
			WHERE unit_id = $1
			  AND status NOT IN ('cancelled')
			  AND daterange(check_in, check_out, '[)') && daterange($2::date, $3::date, '[)')
		)
	`, req.UnitID, req.CheckIn, req.CheckOut).Scan(&conflict)
	if err != nil || conflict {
		return nil, ErrUnavailable
	}

	// 3. Build price snapshots
	// (Prices per night queried from seasonal_rates — never from frontend)
	var snapshots []priceRow
	rows, err := tx.Query(ctx, `
		SELECT
			generate_series($1::date, $2::date - INTERVAL '1 day', INTERVAL '1 day')::date AS night,
			sr.price_irr,
			rp.id,
			rpt.name
		FROM seasonal_rates sr
		JOIN rate_plans rp ON rp.id = sr.plan_id
		JOIN rate_plan_translations rpt ON rpt.plan_id = rp.id AND rpt.locale = $4
		WHERE rp.id = $3
		  AND daterange(sr.date_from, sr.date_to, '[]') && daterange($1::date, $2::date, '[)')
		ORDER BY night
	`, req.CheckIn, req.CheckOut, req.PlanID, req.Locale)
	if err != nil {
		return nil, fmt.Errorf("price query: %w", err)
	}
	defer rows.Close()
	var total int64
	for rows.Next() {
		var p priceRow
		if err := rows.Scan(&p.Date, &p.PriceIRR, &p.PlanID, &p.RateName); err != nil {
			return nil, err
		}
		total += p.PriceIRR
		snapshots = append(snapshots, p)
	}

	// 4. Verify that the total matches what the guest agreed to pay
	// (Prevents price manipulation from the frontend)
	if domain.Money(total) != req.AgreedTotalIRR {
		return nil, fmt.Errorf("price mismatch: quoted %d, current %d", req.AgreedTotalIRR, total)
	}

	// 5. Ensure guest exists
	guestID, err := upsertGuest(ctx, tx, req.Guest)
	if err != nil {
		return nil, err
	}

	// 6. Create reservation
	res := &domain.Reservation{
		ID:              uuid.New(),
		ReservationNo:   generateReservationNo(),
		GuestID:         guestID,
		UnitID:          req.UnitID,
		PlanID:          req.PlanID,
		CheckIn:         req.CheckIn,
		CheckOut:        req.CheckOut,
		Adults:          req.Adults,
		Children:        req.Children,
		Status:          domain.StatusConfirmed,
		TotalIRR:        domain.Money(total),
		PolicyVersion:   req.PolicyVersion,
		SpecialRequests: req.SpecialRequests,
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO reservations
			(id, reservation_no, guest_id, unit_id, plan_id, check_in, check_out,
			 adults, children, children_ages, status, source, special_requests,
			 total_irr, policy_version, confirmed_at)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,NOW())
	`, res.ID, res.ReservationNo, res.GuestID, res.UnitID, res.PlanID,
		res.CheckIn, res.CheckOut, res.Adults, res.Children, req.ChildrenAges,
		res.Status, domain.BookingSourceDirectWeb, res.SpecialRequests,
		int64(res.TotalIRR), res.PolicyVersion)
	if err != nil {
		return nil, fmt.Errorf("insert reservation: %w", err)
	}

	// 7. Insert price snapshots
	for _, snap := range snapshots {
		_, err = tx.Exec(ctx, `
			INSERT INTO reservation_price_snapshot
				(id, reservation_id, date, price_irr, plan_id, rate_name)
			VALUES ($1,$2,$3,$4,$5,$6)
		`, uuid.New(), res.ID, snap.Date, snap.PriceIRR, snap.PlanID, snap.RateName)
		if err != nil {
			return nil, fmt.Errorf("insert snapshot: %w", err)
		}
	}

	// 8. Release the hold
	_, err = tx.Exec(ctx, `DELETE FROM booking_holds WHERE id = $1`, req.HoldID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit: %w", err)
	}

	return res, nil
}

// types used internally

type SearchRequest struct {
	CheckIn     time.Time
	CheckOut    time.Time
	Adults      int
	Children    int
	RequirePool bool
}

type HoldRequest struct {
	UnitID    uuid.UUID
	CheckIn   time.Time
	CheckOut  time.Time
	SessionID string
}

type Hold struct {
	ID        uuid.UUID
	ExpiresAt time.Time
}

type ConfirmRequest struct {
	HoldID          uuid.UUID
	SessionID       string
	UnitID          uuid.UUID
	PlanID          uuid.UUID
	CheckIn         time.Time
	CheckOut        time.Time
	Adults          int
	Children        int
	ChildrenAges    []int
	AgreedTotalIRR  domain.Money
	Guest           GuestInput
	SpecialRequests string
	PolicyVersion   string
	Locale          string
}

type GuestInput struct {
	FullName string
	Email    string
	Phone    string
	UserID   *uuid.UUID
}

type priceRow struct {
	Date     time.Time
	PriceIRR int64
	PlanID   uuid.UUID
	RateName string
}

func generateReservationNo() string {
	return fmt.Sprintf("HIR-%d", time.Now().UnixMilli()%10_000_000)
}

func upsertGuest(ctx context.Context, tx pgx.Tx, g GuestInput) (uuid.UUID, error) {
	id := uuid.New()
	_, err := tx.Exec(ctx, `
		INSERT INTO guests (id, user_id, full_name, email, phone)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (email) WHERE email IS NOT NULL
		DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone
		RETURNING id
	`, id, g.UserID, g.FullName, g.Email, g.Phone)
	return id, err
}
