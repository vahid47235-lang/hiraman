package server

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/hiraban/api/internal/config"
	"github.com/hiraban/api/internal/database"
	"github.com/hiraban/api/internal/middleware"
	"go.uber.org/zap"
)

func New(cfg *config.Config, db *database.DB, logger *zap.Logger) http.Handler {
	r := chi.NewRouter()

	// ── Global middleware ──────────────────────────────────────────────────────
	r.Use(chiMiddleware.RequestID)
	r.Use(middleware.CorrelationID)
	r.Use(middleware.Logger(logger))
	r.Use(chiMiddleware.Recoverer)
	r.Use(chiMiddleware.Timeout(30 * time.Second))
	r.Use(chiMiddleware.StripSlashes)

	// CORS — strict; only allow configured origins
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   cfg.AllowedOrigins,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-Request-ID"},
		ExposedHeaders:   []string{"X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Security headers
	r.Use(middleware.SecurityHeaders)

	// Rate limiting (global)
	r.Use(middleware.RateLimit(cfg))

	// ── Health ────────────────────────────────────────────────────────────────
	r.Get("/health", handleHealth(db))
	r.Get("/ready", handleReady(db))

	// ── Public API v1 ─────────────────────────────────────────────────────────
	r.Route("/api/v1", func(r chi.Router) {
		// Accommodation
		r.Route("/accommodations", func(r chi.Router) {
			r.Get("/", handleListAccommodations(db))
			r.Get("/{slug}", handleGetAccommodation(db))
			r.Get("/{slug}/availability", handleAccommodationAvailability(db))
		})

		// Availability search
		r.Get("/availability", handleAvailabilitySearch(db))

		// Services
		r.Route("/services", func(r chi.Router) {
			r.Get("/", handleListServices(db))
			r.Get("/{slug}", handleGetService(db))
			r.Get("/{slug}/slots", handleServiceSlots(db))
		})

		// Packages
		r.Get("/packages", handleListPackages(db))
		r.Get("/packages/{slug}", handleGetPackage(db))

		// Reviews
		r.Get("/reviews", handleListReviews(db))

		// Blog
		r.Get("/blog", handleListPosts(db))
		r.Get("/blog/{slug}", handleGetPost(db))
		r.Get("/blog/categories", handleListCategories(db))

		// FAQ
		r.Get("/faq", handleListFAQ(db))

		// Pages & SEO
		r.Get("/pages/{slug}", handleGetPage(db))

		// Auth — rate-limited more aggressively
		r.Route("/auth", func(r chi.Router) {
			r.Use(middleware.StrictRateLimit(cfg))
			r.Post("/register", handleRegister(db))
			r.Post("/login", handleLogin(db))
			r.Post("/logout", handleLogout(db))
			r.Post("/refresh", handleRefreshToken(db))
			r.Post("/forgot-password", handleForgotPassword(db))
			r.Post("/reset-password", handleResetPassword(db))
			r.Post("/verify-email", handleVerifyEmail(db))
			r.Post("/verify-otp", handleVerifyOTP(db))
		})

		// Reservations — authenticated guests
		r.Route("/reservations", func(r chi.Router) {
			r.Use(middleware.RequireAuth(cfg))
			r.Post("/", handleCreateReservation(db))
			r.Get("/", handleListMyReservations(db))
			r.Get("/{id}", handleGetReservation(db))
			r.Patch("/{id}/cancel", handleCancelReservation(db))
		})

		// Booking hold — session-based, no auth required
		r.Post("/holds", handleCreateHold(db))
		r.Delete("/holds/{id}", handleReleaseHold(db))

		// Service bookings
		r.Route("/service-bookings", func(r chi.Router) {
			r.Post("/", handleCreateServiceBooking(db))
			r.Group(func(r chi.Router) {
				r.Use(middleware.RequireAuth(cfg))
				r.Get("/", handleListMyServiceBookings(db))
			})
		})

		// Payments
		r.Route("/payments", func(r chi.Router) {
			r.Post("/initiate", handleInitiatePayment(db))
			r.Post("/callback", handlePaymentCallback(db, cfg)) // gateway webhook
		})

		// Contact
		r.Post("/contact", handleContactForm(db, cfg))

		// Newsletter
		r.Post("/newsletter/subscribe", handleNewsletterSubscribe(db))

		// Reviews — post-stay only
		r.With(middleware.RequireAuth(cfg)).Post("/reviews", handleSubmitReview(db))

		// Profile
		r.Route("/profile", func(r chi.Router) {
			r.Use(middleware.RequireAuth(cfg))
			r.Get("/", handleGetProfile(db))
			r.Patch("/", handleUpdateProfile(db))
		})
	})

	// ── Admin API v1 ──────────────────────────────────────────────────────────
	r.Route("/api/admin/v1", func(r chi.Router) {
		r.Use(middleware.RequireAdminAuth(cfg))
		r.Use(middleware.AuditLog(db, logger))

		// Dashboard
		r.Get("/dashboard/metrics", handleAdminMetrics(db))

		// Reservations
		r.Route("/reservations", func(r chi.Router) {
			r.Get("/", handleAdminListReservations(db))
			r.Post("/", handleAdminCreateReservation(db))
			r.Get("/{id}", handleAdminGetReservation(db))
			r.Patch("/{id}", handleAdminUpdateReservation(db))
			r.Post("/{id}/cancel", handleAdminCancelReservation(db))
			r.Post("/{id}/check-in", handleAdminCheckIn(db))
			r.Post("/{id}/check-out", handleAdminCheckOut(db))
			r.Post("/{id}/no-show", handleAdminNoShow(db))
		})

		// Accommodations
		r.Route("/accommodations", func(r chi.Router) {
			r.Get("/", handleAdminListAccommodations(db))
			r.Post("/", handleAdminCreateAccommodationType(db))
			r.Put("/{id}", handleAdminUpdateAccommodationType(db))
			r.Get("/inventory", handleAdminGetInventory(db))
			r.Put("/inventory", handleAdminUpdateInventory(db))
			r.Put("/rates", handleAdminUpdateRates(db))
		})

		// Services
		r.Route("/services", func(r chi.Router) {
			r.Get("/", handleAdminListServices(db))
			r.Post("/", handleAdminCreateService(db))
			r.Put("/{id}", handleAdminUpdateService(db))
			r.Get("/{id}/slots", handleAdminGetSlots(db))
			r.Post("/{id}/slots", handleAdminCreateSlot(db))
		})

		// Payments & Refunds
		r.Route("/payments", func(r chi.Router) {
			r.Get("/", handleAdminListPayments(db))
			r.Post("/{id}/refund", handleAdminRefund(db))
		})

		// Reviews
		r.Route("/reviews", func(r chi.Router) {
			r.Get("/", handleAdminListReviews(db))
			r.Patch("/{id}/approve", handleAdminApproveReview(db))
			r.Patch("/{id}/reject", handleAdminRejectReview(db))
			r.Post("/{id}/response", handleAdminReviewResponse(db))
		})

		// CMS
		r.Route("/pages", func(r chi.Router) {
			r.Get("/", handleAdminListPages(db))
			r.Post("/", handleAdminCreatePage(db))
			r.Get("/{id}", handleAdminGetPage(db))
			r.Put("/{id}/sections", handleAdminUpdateSections(db))
			r.Post("/{id}/publish", handleAdminPublishPage(db))
			r.Get("/{id}/versions", handleAdminPageVersions(db))
			r.Post("/{id}/restore/{version}", handleAdminRestoreVersion(db))
		})

		// Blog
		r.Route("/blog", func(r chi.Router) {
			r.Get("/", handleAdminListPosts(db))
			r.Post("/", handleAdminCreatePost(db))
			r.Put("/{id}", handleAdminUpdatePost(db))
			r.Post("/{id}/publish", handleAdminPublishPost(db))
		})

		// Users & staff
		r.Route("/users", func(r chi.Router) {
			r.Use(middleware.RequirePermission("users", "view"))
			r.Get("/", handleAdminListUsers(db))
			r.Post("/invite", handleAdminInviteUser(db))
			r.Patch("/{id}/status", handleAdminUpdateUserStatus(db))
			r.Patch("/{id}/roles", handleAdminUpdateUserRoles(db))
			r.Post("/{id}/force-logout", handleAdminForceLogout(db))
		})

		// CRM
		r.Route("/crm", func(r chi.Router) {
			r.Get("/guests", handleAdminListGuests(db))
			r.Get("/segments", handleAdminListSegments(db))
			r.Post("/campaigns", handleAdminCreateCampaign(db))
			r.Get("/campaigns", handleAdminListCampaigns(db))
			r.Post("/campaigns/{id}/send", handleAdminSendCampaign(db))
		})

		// Templates
		r.Get("/templates", handleAdminListTemplates(db))
		r.Post("/templates/{id}/test", handleAdminTestTemplate(db))

		// Media
		r.Post("/media/upload", handleAdminMediaUpload(cfg))
		r.Delete("/media/{id}", handleAdminDeleteMedia(db, cfg))

		// Audit
		r.Get("/audit-logs", handleAdminAuditLogs(db))
	})

	// ── 404 ───────────────────────────────────────────────────────────────────
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "not found"})
	})

	return r
}

func handleHealth(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
	}
}

func handleReady(db *database.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := db.Ping(r.Context()); err != nil {
			writeJSON(w, http.StatusServiceUnavailable, map[string]string{"status": "db unavailable"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"status": "ready"})
	}
}

// Stub handler builders — each is implemented in its own package file.
// Defined here to allow the router to compile as a complete unit.

func handleListAccommodations(db *database.DB) http.HandlerFunc  { return stub }
func handleGetAccommodation(db *database.DB) http.HandlerFunc    { return stub }
func handleAccommodationAvailability(db *database.DB) http.HandlerFunc { return stub }
func handleAvailabilitySearch(db *database.DB) http.HandlerFunc  { return stub }
func handleListServices(db *database.DB) http.HandlerFunc        { return stub }
func handleGetService(db *database.DB) http.HandlerFunc          { return stub }
func handleServiceSlots(db *database.DB) http.HandlerFunc        { return stub }
func handleListPackages(db *database.DB) http.HandlerFunc        { return stub }
func handleGetPackage(db *database.DB) http.HandlerFunc          { return stub }
func handleListReviews(db *database.DB) http.HandlerFunc         { return stub }
func handleListPosts(db *database.DB) http.HandlerFunc           { return stub }
func handleGetPost(db *database.DB) http.HandlerFunc             { return stub }
func handleListCategories(db *database.DB) http.HandlerFunc      { return stub }
func handleListFAQ(db *database.DB) http.HandlerFunc             { return stub }
func handleGetPage(db *database.DB) http.HandlerFunc             { return stub }
func handleRegister(db *database.DB) http.HandlerFunc            { return stub }
func handleLogin(db *database.DB) http.HandlerFunc               { return stub }
func handleLogout(db *database.DB) http.HandlerFunc              { return stub }
func handleRefreshToken(db *database.DB) http.HandlerFunc        { return stub }
func handleForgotPassword(db *database.DB) http.HandlerFunc      { return stub }
func handleResetPassword(db *database.DB) http.HandlerFunc       { return stub }
func handleVerifyEmail(db *database.DB) http.HandlerFunc         { return stub }
func handleVerifyOTP(db *database.DB) http.HandlerFunc           { return stub }
func handleCreateReservation(db *database.DB) http.HandlerFunc   { return stub }
func handleListMyReservations(db *database.DB) http.HandlerFunc  { return stub }
func handleGetReservation(db *database.DB) http.HandlerFunc      { return stub }
func handleCancelReservation(db *database.DB) http.HandlerFunc   { return stub }
func handleCreateHold(db *database.DB) http.HandlerFunc          { return stub }
func handleReleaseHold(db *database.DB) http.HandlerFunc         { return stub }
func handleCreateServiceBooking(db *database.DB) http.HandlerFunc { return stub }
func handleListMyServiceBookings(db *database.DB) http.HandlerFunc { return stub }
func handleInitiatePayment(db *database.DB) http.HandlerFunc     { return stub }
func handlePaymentCallback(db *database.DB, cfg *config.Config) http.HandlerFunc { return stub }
func handleContactForm(db *database.DB, cfg *config.Config) http.HandlerFunc { return stub }
func handleNewsletterSubscribe(db *database.DB) http.HandlerFunc { return stub }
func handleSubmitReview(db *database.DB) http.HandlerFunc        { return stub }
func handleGetProfile(db *database.DB) http.HandlerFunc          { return stub }
func handleUpdateProfile(db *database.DB) http.HandlerFunc       { return stub }

func handleAdminMetrics(db *database.DB) http.HandlerFunc            { return stub }
func handleAdminListReservations(db *database.DB) http.HandlerFunc   { return stub }
func handleAdminCreateReservation(db *database.DB) http.HandlerFunc  { return stub }
func handleAdminGetReservation(db *database.DB) http.HandlerFunc     { return stub }
func handleAdminUpdateReservation(db *database.DB) http.HandlerFunc  { return stub }
func handleAdminCancelReservation(db *database.DB) http.HandlerFunc  { return stub }
func handleAdminCheckIn(db *database.DB) http.HandlerFunc            { return stub }
func handleAdminCheckOut(db *database.DB) http.HandlerFunc           { return stub }
func handleAdminNoShow(db *database.DB) http.HandlerFunc             { return stub }
func handleAdminListAccommodations(db *database.DB) http.HandlerFunc { return stub }
func handleAdminCreateAccommodationType(db *database.DB) http.HandlerFunc { return stub }
func handleAdminUpdateAccommodationType(db *database.DB) http.HandlerFunc { return stub }
func handleAdminGetInventory(db *database.DB) http.HandlerFunc       { return stub }
func handleAdminUpdateInventory(db *database.DB) http.HandlerFunc    { return stub }
func handleAdminUpdateRates(db *database.DB) http.HandlerFunc        { return stub }
func handleAdminListServices(db *database.DB) http.HandlerFunc       { return stub }
func handleAdminCreateService(db *database.DB) http.HandlerFunc      { return stub }
func handleAdminUpdateService(db *database.DB) http.HandlerFunc      { return stub }
func handleAdminGetSlots(db *database.DB) http.HandlerFunc           { return stub }
func handleAdminCreateSlot(db *database.DB) http.HandlerFunc         { return stub }
func handleAdminListPayments(db *database.DB) http.HandlerFunc       { return stub }
func handleAdminRefund(db *database.DB) http.HandlerFunc             { return stub }
func handleAdminListReviews(db *database.DB) http.HandlerFunc        { return stub }
func handleAdminApproveReview(db *database.DB) http.HandlerFunc      { return stub }
func handleAdminRejectReview(db *database.DB) http.HandlerFunc       { return stub }
func handleAdminReviewResponse(db *database.DB) http.HandlerFunc     { return stub }
func handleAdminListPages(db *database.DB) http.HandlerFunc          { return stub }
func handleAdminCreatePage(db *database.DB) http.HandlerFunc         { return stub }
func handleAdminGetPage(db *database.DB) http.HandlerFunc            { return stub }
func handleAdminUpdateSections(db *database.DB) http.HandlerFunc     { return stub }
func handleAdminPublishPage(db *database.DB) http.HandlerFunc        { return stub }
func handleAdminPageVersions(db *database.DB) http.HandlerFunc       { return stub }
func handleAdminRestoreVersion(db *database.DB) http.HandlerFunc     { return stub }
func handleAdminListPosts(db *database.DB) http.HandlerFunc          { return stub }
func handleAdminCreatePost(db *database.DB) http.HandlerFunc         { return stub }
func handleAdminUpdatePost(db *database.DB) http.HandlerFunc         { return stub }
func handleAdminPublishPost(db *database.DB) http.HandlerFunc        { return stub }
func handleAdminListUsers(db *database.DB) http.HandlerFunc          { return stub }
func handleAdminInviteUser(db *database.DB) http.HandlerFunc         { return stub }
func handleAdminUpdateUserStatus(db *database.DB) http.HandlerFunc   { return stub }
func handleAdminUpdateUserRoles(db *database.DB) http.HandlerFunc    { return stub }
func handleAdminForceLogout(db *database.DB) http.HandlerFunc        { return stub }
func handleAdminListGuests(db *database.DB) http.HandlerFunc         { return stub }
func handleAdminListSegments(db *database.DB) http.HandlerFunc       { return stub }
func handleAdminCreateCampaign(db *database.DB) http.HandlerFunc     { return stub }
func handleAdminListCampaigns(db *database.DB) http.HandlerFunc      { return stub }
func handleAdminSendCampaign(db *database.DB) http.HandlerFunc       { return stub }
func handleAdminListTemplates(db *database.DB) http.HandlerFunc      { return stub }
func handleAdminTestTemplate(db *database.DB) http.HandlerFunc       { return stub }
func handleAdminMediaUpload(cfg *config.Config) http.HandlerFunc     { return stub }
func handleAdminDeleteMedia(db *database.DB, cfg *config.Config) http.HandlerFunc { return stub }
func handleAdminAuditLogs(db *database.DB) http.HandlerFunc          { return stub }

// stub returns a 501 Not Implemented for unimplemented endpoints.
var stub http.HandlerFunc = func(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusNotImplemented, map[string]string{"error": "not implemented"})
}
