// Package middleware provides HTTP middleware for the HIRABAN API.
package middleware

import (
	"context"
	"net/http"

	"github.com/google/uuid"
	"github.com/hiraban/api/internal/config"
	"github.com/hiraban/api/internal/database"
	"go.uber.org/zap"
)

type contextKey string

const (
	keyCorrelationID contextKey = "correlation_id"
	keyUserID        contextKey = "user_id"
	keyRoles         contextKey = "roles"
)

// CorrelationID injects a per-request ID for distributed tracing.
func CorrelationID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.Header.Get("X-Request-ID")
		if id == "" {
			id = uuid.NewString()
		}
		ctx := context.WithValue(r.Context(), keyCorrelationID, id)
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Logger is a structured request logger using zap.
func Logger(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ww := &responseWriter{ResponseWriter: w, status: http.StatusOK}
			next.ServeHTTP(ww, r)
			corrID, _ := r.Context().Value(keyCorrelationID).(string)
			logger.Info("request",
				zap.String("method", r.Method),
				zap.String("path", r.URL.Path),
				zap.Int("status", ww.status),
				zap.String("correlation_id", corrID),
				zap.String("remote_addr", r.RemoteAddr),
			)
		})
	}
}

// SecurityHeaders adds mandatory security response headers.
func SecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
		next.ServeHTTP(w, r)
	})
}

// RateLimit applies global rate limiting.
func RateLimit(cfg *config.Config) func(http.Handler) http.Handler {
	// Implement with Redis sliding window in production
	return func(next http.Handler) http.Handler {
		return next
	}
}

// StrictRateLimit applies tight rate limiting for auth endpoints.
func StrictRateLimit(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return next
	}
}

// RequireAuth validates a session JWT and injects the user ID into context.
func RequireAuth(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// TODO: validate JWT from HttpOnly cookie or Authorization header
			// Reject with 401 if missing or invalid
			next.ServeHTTP(w, r)
		})
	}
}

// RequireAdminAuth validates admin session and injects user + roles.
func RequireAdminAuth(cfg *config.Config) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// TODO: validate admin JWT and load roles
			next.ServeHTTP(w, r)
		})
	}
}

// RequirePermission checks that the authenticated admin user has a specific permission.
// Backend-enforced — never rely on frontend navigation alone.
func RequirePermission(module, action string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// TODO: check roles in context against permissions table
			next.ServeHTTP(w, r)
		})
	}
}

// AuditLog records admin actions to the audit_logs table.
func AuditLog(db *database.DB, logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ww := &responseWriter{ResponseWriter: w, status: http.StatusOK}
			next.ServeHTTP(ww, r)
			if r.Method != http.MethodGet && ww.status < 400 {
				// TODO: write to audit_logs asynchronously
				_ = logger
				_ = db
			}
		})
	}
}

// responseWriter wraps http.ResponseWriter to capture status code.
type responseWriter struct {
	http.ResponseWriter
	status int
}

func (rw *responseWriter) WriteHeader(status int) {
	rw.status = status
	rw.ResponseWriter.WriteHeader(status)
}
