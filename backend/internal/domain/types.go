// Package domain defines the core business types for HIRABAN.
package domain

import (
	"time"

	"github.com/google/uuid"
)

// Locale represents a supported language.
type Locale string

const (
	LocaleFa Locale = "fa"
	LocaleEn Locale = "en"
)

// ReservationStatus tracks the lifecycle of a booking.
type ReservationStatus string

const (
	StatusPending   ReservationStatus = "pending"
	StatusHold      ReservationStatus = "hold"
	StatusConfirmed ReservationStatus = "confirmed"
	StatusModified  ReservationStatus = "modified"
	StatusCancelled ReservationStatus = "cancelled"
	StatusNoShow    ReservationStatus = "no_show"
	StatusCompleted ReservationStatus = "completed"
)

// PaymentStatus tracks a payment's lifecycle.
type PaymentStatus string

const (
	PaymentPending           PaymentStatus = "pending"
	PaymentAuthorized        PaymentStatus = "authorized"
	PaymentCaptured          PaymentStatus = "captured"
	PaymentFailed            PaymentStatus = "failed"
	PaymentRefunded          PaymentStatus = "refunded"
	PaymentPartiallyRefunded PaymentStatus = "partially_refunded"
)

// Money represents an amount in IRR (Tomans). Always use integer arithmetic.
type Money int64

// Reservation is the central booking entity.
type Reservation struct {
	ID             uuid.UUID         `json:"id"`
	ReservationNo  string            `json:"reservation_no"`
	GuestID        uuid.UUID         `json:"guest_id"`
	UnitID         uuid.UUID         `json:"unit_id"`
	PlanID         uuid.UUID         `json:"plan_id"`
	CheckIn        time.Time         `json:"check_in"`
	CheckOut       time.Time         `json:"check_out"`
	Adults         int               `json:"adults"`
	Children       int               `json:"children"`
	ChildrenAges   []int             `json:"children_ages,omitempty"`
	Status         ReservationStatus `json:"status"`
	TotalIRR       Money             `json:"total_irr"`
	PolicyVersion  string            `json:"policy_version"`
	SpecialRequests string           `json:"special_requests,omitempty"`
	CreatedAt      time.Time         `json:"created_at"`
	UpdatedAt      time.Time         `json:"updated_at"`
}

// AccommodationUnit is a bookable unit.
type AccommodationUnit struct {
	ID       uuid.UUID `json:"id"`
	TypeID   uuid.UUID `json:"type_id"`
	UnitCode string    `json:"unit_code"`
	Active   bool      `json:"active"`
}

// PriceSnapshot records the price of a single night at booking time.
// Immutable after creation.
type PriceSnapshot struct {
	ID            uuid.UUID `json:"id"`
	ReservationID uuid.UUID `json:"reservation_id"`
	Date          time.Time `json:"date"`
	PriceIRR      Money     `json:"price_irr"`
	PlanID        uuid.UUID `json:"plan_id"`
	RateName      string    `json:"rate_name"`
}

// Guest is a person who makes or occupies a reservation.
type Guest struct {
	ID       uuid.UUID `json:"id"`
	UserID   *uuid.UUID `json:"user_id,omitempty"`
	FullName string    `json:"full_name"`
	Email    string    `json:"email"`
	Phone    string    `json:"phone"`
	Locale   Locale    `json:"locale"`
}

// Payment represents a payment transaction.
type Payment struct {
	ID              uuid.UUID     `json:"id"`
	ReservationID   *uuid.UUID    `json:"reservation_id,omitempty"`
	AmountIRR       Money         `json:"amount_irr"`
	Status          PaymentStatus `json:"status"`
	Gateway         string        `json:"gateway"`
	IdempotencyKey  string        `json:"idempotency_key"`
	PaidAt          *time.Time    `json:"paid_at,omitempty"`
	CreatedAt       time.Time     `json:"created_at"`
}

// ReviewSummary is an aggregate view of reviews for a listing.
type ReviewSummary struct {
	TotalCount    int     `json:"total_count"`
	AverageRating float64 `json:"average_rating"`
	Distribution  [5]int  `json:"distribution"` // index 0 = 1-star, 4 = 5-star
}

// AvailabilityResult is returned from an availability search.
type AvailabilityResult struct {
	TypeID       uuid.UUID `json:"type_id"`
	UnitID       uuid.UUID `json:"unit_id"`
	CheckIn      time.Time `json:"check_in"`
	CheckOut     time.Time `json:"check_out"`
	Nights       int       `json:"nights"`
	PricePerNight Money    `json:"price_per_night"`
	TotalIRR     Money     `json:"total_irr"`
	PlanID       uuid.UUID `json:"plan_id"`
	Available    bool      `json:"available"`
}

// ServiceSlotAvailability describes an available time slot for a service.
type ServiceSlotAvailability struct {
	SlotID    uuid.UUID `json:"slot_id"`
	ServiceID uuid.UUID `json:"service_id"`
	Date      time.Time `json:"date"`
	StartTime string    `json:"start_time"`
	EndTime   string    `json:"end_time"`
	Remaining int       `json:"remaining"`
	PriceIRR  Money     `json:"price_irr"`
}
