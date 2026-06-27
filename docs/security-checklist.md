# HIRABAN Security Checklist

Based on OWASP ASVS L2 and OWASP API Security Top 10.

## Authentication

- [ ] Argon2id password hashing (min cost: time=1, memory=64MB, threads=4)
- [ ] No password stored in plaintext or reversible hash
- [ ] MFA required for Super Admin, General Manager, Finance Manager
- [ ] MFA optional for all other staff
- [ ] Passkey (WebAuthn) support for admin login
- [ ] Brute-force protection: lock account after 5 failed attempts
- [ ] Safe lockout: notify user, provide email recovery — not just a timer
- [ ] Login alerts: email notification on new device or unusual location
- [ ] OTP codes: 6-digit, numeric, expire after 5 minutes, single-use
- [ ] OTP codes must render LTR in all templates
- [ ] Forgot password: constant-time response regardless of email existence
- [ ] Email verification required before full account activation

## Sessions

- [ ] Session tokens in HttpOnly, Secure, SameSite=Lax cookies
- [ ] Admin sessions: shorter TTL (4 hours idle, 8 hours absolute)
- [ ] Guest sessions: 30-day sliding expiry
- [ ] Session ID rotated after login
- [ ] All sessions invalidated on password change
- [ ] "Log out all devices" function available to users and admins
- [ ] Admin can force-logout any user
- [ ] No JWT/session data in localStorage for privileged sessions
- [ ] CSRF token for state-mutating requests from browser (SameSite=Strict can replace for same-origin)

## Authorization

- [ ] Backend enforces RBAC on every protected endpoint
- [ ] No security by navigation only
- [ ] Deny by default — no implicit grants
- [ ] PostgreSQL Row-Level Security enabled for sensitive tables (guests, payments)
- [ ] Sensitive fields (national_id, phone) masked in logs
- [ ] Finance operations require finance_manager or higher role
- [ ] Content publish requires explicit publish permission
- [ ] Review moderation requires customer_support or higher

## API Security

- [ ] HTTPS only — HSTS header with includeSubDomains and preload
- [ ] All JSON inputs validated server-side (type, length, range, format)
- [ ] Response filtering — never return fields not needed by caller
- [ ] Global rate limit: 300 req/min per IP
- [ ] Auth endpoints: 10 attempts/min per IP
- [ ] Payment initiation: 5 attempts/min per session
- [ ] Maximum request body: 1MB (10MB for media upload)
- [ ] Request timeout: 30s (60s for media upload)
- [ ] CORS: explicit allowlist of origins only — no wildcard
- [ ] Payment callback: verify gateway signature (HMAC/RSA) before processing
- [ ] Payment callback: idempotent — re-processing same reference must be safe
- [ ] No secrets in query parameters — all auth via headers or cookies
- [ ] Error responses never include stack traces or internal paths
- [ ] Correlation IDs in all logs for tracing

## Application Security

- [ ] Parameterized queries everywhere — no string concatenation in SQL
- [ ] XSS: output encoded in all templates; Content-Security-Policy header
- [ ] SSRF protection: block internal IP ranges in any URL-fetching feature
- [ ] File uploads: validate MIME type, file extension, magic bytes
- [ ] Image uploads: re-process through Sharp before serving (strips EXIF, ensures safe format)
- [ ] Malware scan integration for all uploaded files
- [ ] Admin HTML block: sanitized, restricted to super_admin, logged, CSP-protected
- [ ] Dependency scanning: run `govulncheck` on Go, `pnpm audit` on JS in CI
- [ ] Secret scanning: `git-secrets` or `truffleHog` in pre-commit and CI
- [ ] Static analysis: `golangci-lint` on Go, ESLint on TypeScript

## Data Protection

- [ ] Collect only necessary personal data
- [ ] Encrypt backups (AES-256 or equivalent)
- [ ] National ID numbers encrypted at rest in database
- [ ] Sensitive fields masked in application logs
- [ ] Staff access to guest PII logged to audit_logs
- [ ] Data retention policy documented and enforced
- [ ] Guest data export endpoint (GDPR right of access)
- [ ] Guest data deletion endpoint (GDPR right to erasure)
- [ ] Never store full card numbers — all card processing via PCI-DSS certified gateway
- [ ] Payment gateway tokens never logged

## Infrastructure

- [ ] Database not publicly accessible — private VPC only
- [ ] Database user has least privileges (no SUPERUSER, no CREATEDB)
- [ ] API service account cannot DROP tables
- [ ] Redis requires authentication password
- [ ] All service-to-service communication over TLS
- [ ] Secrets managed via environment-specific secret manager (not .env in production)
- [ ] Automated daily PostgreSQL backups with point-in-time recovery
- [ ] Restore procedure tested quarterly
- [ ] WAF in front of public endpoints
- [ ] DDoS mitigation via CDN edge
- [ ] Security events alert to on-call

## Incident Response

- [ ] Incident response plan documented
- [ ] Security contact published (security@hiraban.ir or security.txt)
- [ ] Audit logs retained for 12 months minimum
- [ ] Audit logs immutable — no delete permission for any role
- [ ] Breach notification procedure documented (72-hour window for GDPR if applicable)
- [ ] Staging environment uses anonymized/synthetic data only — never production guest data

## Pre-Launch Checklist

- [ ] Penetration test by external firm before launch
- [ ] All HIGH and CRITICAL findings resolved
- [ ] Payment gateway certification (if required by provider)
- [ ] Privacy policy reviewed by legal
- [ ] Cookie consent compliant with local law
- [ ] Cancellation and refund policy approved by management before publishing
- [ ] FAQ answers verified against actual resort policies — no placeholder answers live
- [ ] Travel platform logos only shown for verified, active listings
- [ ] Review schema only includes reviews actually collected by Hiraban
