package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Env         string
	Port        string
	DatabaseURL string
	RedisURL    string
	JWTSecret   string
	JWTExpiry   string
	// Payment gateway
	PaymentGateway    string
	PaymentMerchantID string
	PaymentCallbackURL string
	// Email
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string
	// SMS
	SMSProvider  string
	SMSAPIKey    string
	SMSSender    string
	// Storage
	StorageBucket    string
	StorageEndpoint  string
	StorageAccessKey string
	StorageSecretKey string
	CDNBaseURL       string
	// Resort
	ResortTimezone string
	// Security
	AllowedOrigins []string
}

func Load() (*Config, error) {
	// Load .env if it exists (dev only — never in production)
	_ = godotenv.Load()

	required := []string{
		"DATABASE_URL",
		"JWT_SECRET",
	}

	for _, key := range required {
		if os.Getenv(key) == "" {
			return nil, fmt.Errorf("required env var %s is not set", key)
		}
	}

	cfg := &Config{
		Env:         getEnv("APP_ENV", "development"),
		Port:        getEnv("PORT", "8080"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
		JWTExpiry:   getEnv("JWT_EXPIRY", "24h"),

		PaymentGateway:     getEnv("PAYMENT_GATEWAY", "zarinpal"),
		PaymentMerchantID:  os.Getenv("PAYMENT_MERCHANT_ID"),
		PaymentCallbackURL: os.Getenv("PAYMENT_CALLBACK_URL"),

		SMTPHost:     os.Getenv("SMTP_HOST"),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUser:     os.Getenv("SMTP_USER"),
		SMTPPassword: os.Getenv("SMTP_PASSWORD"),

		SMSProvider: getEnv("SMS_PROVIDER", "kavenegar"),
		SMSAPIKey:   os.Getenv("SMS_API_KEY"),
		SMSSender:   os.Getenv("SMS_SENDER"),

		StorageBucket:    getEnv("STORAGE_BUCKET", "hiraban-media"),
		StorageEndpoint:  os.Getenv("STORAGE_ENDPOINT"),
		StorageAccessKey: os.Getenv("STORAGE_ACCESS_KEY"),
		StorageSecretKey: os.Getenv("STORAGE_SECRET_KEY"),
		CDNBaseURL:       getEnv("CDN_BASE_URL", "https://cdn.hiraban.ir"),

		ResortTimezone: getEnv("RESORT_TIMEZONE", "Asia/Tehran"),

		AllowedOrigins: []string{
			getEnv("FRONTEND_URL", "http://localhost:3000"),
			getEnv("ADMIN_URL", "http://localhost:3001"),
		},
	}

	return cfg, nil
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
