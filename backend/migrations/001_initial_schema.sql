-- HIRABAN Database Schema — PostgreSQL 16+
-- Migration: 001_initial_schema
-- All timestamps stored in UTC. Resort timezone (Asia/Tehran) applied at display layer.

BEGIN;

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE locale AS ENUM ('fa', 'en');
CREATE TYPE translation_status AS ENUM (
  'incomplete', 'complete', 'awaiting_review', 'published'
);
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending');
CREATE TYPE accommodation_type AS ENUM ('cabin', 'villa');
CREATE TYPE pool_type AS ENUM ('none', 'private_heated', 'private_unheated', 'shared');
CREATE TYPE reservation_status AS ENUM (
  'pending', 'hold', 'confirmed', 'modified', 'cancelled', 'no_show', 'completed'
);
CREATE TYPE payment_status AS ENUM (
  'pending', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded'
);
CREATE TYPE payment_method AS ENUM ('card', 'bank_transfer', 'wallet');
CREATE TYPE refund_status AS ENUM ('pending', 'processed', 'failed');
CREATE TYPE booking_source AS ENUM (
  'direct_web', 'direct_admin', 'booking_com', 'tripadvisor',
  'jabama', 'jajiga', 'eghamat24', 'phone', 'other'
);
CREATE TYPE service_category AS ENUM (
  'wellness', 'massage', 'yoga', 'horse_riding', 'atv',
  'family', 'animal_garden', 'greenhouse', 'restaurant',
  'cafe', 'nature_walk', 'private_event', 'corporate'
);
CREATE TYPE slot_status AS ENUM ('open', 'limited', 'full', 'closed');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE campaign_type AS ENUM ('email', 'sms');
CREATE TYPE campaign_status AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'cancelled');
CREATE TYPE consent_type AS ENUM ('newsletter_email', 'newsletter_sms', 'marketing', 'whatsapp');
CREATE TYPE page_status AS ENUM ('draft', 'pending_review', 'published', 'archived');

-- ─── Users & Auth ─────────────────────────────────────────────────────────────

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT,
  password_hash   TEXT, -- Argon2id
  full_name       TEXT,
  preferred_locale locale NOT NULL DEFAULT 'fa',
  status          user_status NOT NULL DEFAULT 'pending',
  email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  phone_verified  BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_enabled     BOOLEAN NOT NULL DEFAULT FALSE,
  mfa_secret      TEXT, -- encrypted at rest
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE staff (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE,
  department  TEXT,
  title       TEXT,
  notes       TEXT,
  access_expires_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  is_system   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module   TEXT NOT NULL,
  action   TEXT NOT NULL,
  scope    TEXT, -- e.g. 'own', 'department', 'all'
  UNIQUE(module, action, scope)
);

CREATE TABLE role_permissions (
  role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id    UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES users(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE sessions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash   TEXT NOT NULL UNIQUE,
  user_agent   TEXT,
  ip_address   INET,
  expires_at   TIMESTAMPTZ NOT NULL,
  revoked_at   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE login_attempts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  ip_address INET NOT NULL,
  success    BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Accommodation ────────────────────────────────────────────────────────────

CREATE TABLE accommodation_types (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         accommodation_type NOT NULL,
  area_m2      INTEGER NOT NULL,
  pool_type    pool_type NOT NULL DEFAULT 'none',
  bedrooms     INTEGER NOT NULL,
  base_guests  INTEGER NOT NULL,
  max_guests   INTEGER NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE accommodation_type_translations (
  type_id     UUID NOT NULL REFERENCES accommodation_types(id) ON DELETE CASCADE,
  locale      locale NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  meta_title  TEXT,
  meta_desc   TEXT,
  status      translation_status NOT NULL DEFAULT 'incomplete',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (type_id, locale)
);

CREATE TABLE accommodation_units (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id       UUID NOT NULL REFERENCES accommodation_types(id),
  unit_code     TEXT NOT NULL UNIQUE,
  floor_number  INTEGER,
  building_name TEXT,
  notes         TEXT,
  active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE amenities (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug    TEXT NOT NULL UNIQUE,
  icon    TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE amenity_translations (
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  locale     locale NOT NULL,
  name       TEXT NOT NULL,
  PRIMARY KEY (amenity_id, locale)
);

CREATE TABLE type_amenities (
  type_id    UUID NOT NULL REFERENCES accommodation_types(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  highlighted BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (type_id, amenity_id)
);

-- ─── Pricing & Inventory ──────────────────────────────────────────────────────

CREATE TABLE rate_plans (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id        UUID NOT NULL REFERENCES accommodation_types(id),
  code           TEXT NOT NULL,
  includes_breakfast BOOLEAN NOT NULL DEFAULT FALSE,
  includes_meal_plan BOOLEAN NOT NULL DEFAULT FALSE,
  cancellation_hours_free INTEGER, -- hours before checkin for free cancel
  cancellation_penalty_pct NUMERIC(5,2) DEFAULT 100,
  is_refundable  BOOLEAN NOT NULL DEFAULT TRUE,
  min_stay_nights INTEGER NOT NULL DEFAULT 1,
  max_stay_nights INTEGER,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (type_id, code)
);

CREATE TABLE rate_plan_translations (
  plan_id    UUID NOT NULL REFERENCES rate_plans(id) ON DELETE CASCADE,
  locale     locale NOT NULL,
  name       TEXT NOT NULL,
  description TEXT,
  PRIMARY KEY (plan_id, locale)
);

CREATE TABLE seasonal_rates (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id      UUID NOT NULL REFERENCES rate_plans(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  date_from    DATE NOT NULL,
  date_to      DATE NOT NULL,
  price_irr    BIGINT NOT NULL, -- price in Tomans
  extra_guest_price_irr BIGINT NOT NULL DEFAULT 0,
  CONSTRAINT valid_date_range CHECK (date_to > date_from),
  EXCLUDE USING GIST (plan_id WITH =, daterange(date_from, date_to, '[]') WITH &&)
);

CREATE TABLE inventory (
  unit_id     UUID NOT NULL REFERENCES accommodation_units(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  plan_id     UUID REFERENCES rate_plans(id),
  price_override_irr BIGINT,
  closed      BOOLEAN NOT NULL DEFAULT FALSE,
  close_reason TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (unit_id, date)
);

CREATE TABLE booking_holds (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id      UUID NOT NULL REFERENCES accommodation_units(id),
  date_from    DATE NOT NULL,
  date_to      DATE NOT NULL,
  session_id   TEXT NOT NULL,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  EXCLUDE USING GIST (
    unit_id WITH =,
    daterange(date_from, date_to, '[)') WITH &&
  ) WHERE (expires_at > NOW())
);

-- ─── Reservations ────────────────────────────────────────────────────────────

CREATE TABLE guests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id),
  full_name   TEXT NOT NULL,
  email       TEXT,
  phone       TEXT,
  national_id TEXT, -- encrypted
  locale      locale NOT NULL DEFAULT 'fa',
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reservations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_no  TEXT NOT NULL UNIQUE, -- human-readable e.g. HIR-20250001
  guest_id        UUID NOT NULL REFERENCES guests(id),
  unit_id         UUID NOT NULL REFERENCES accommodation_units(id),
  plan_id         UUID NOT NULL REFERENCES rate_plans(id),
  check_in        DATE NOT NULL,
  check_out       DATE NOT NULL,
  adults          INTEGER NOT NULL,
  children        INTEGER NOT NULL DEFAULT 0,
  children_ages   INTEGER[],
  status          reservation_status NOT NULL DEFAULT 'pending',
  source          booking_source NOT NULL DEFAULT 'direct_web',
  external_ref    TEXT, -- OTA booking reference
  special_requests TEXT,
  notes           TEXT, -- internal staff notes
  total_irr       BIGINT NOT NULL,
  policy_version  TEXT NOT NULL, -- version of T&C accepted
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ,
  cancel_reason   TEXT,
  CONSTRAINT valid_dates CHECK (check_out > check_in),
  EXCLUDE USING GIST (
    unit_id WITH =,
    daterange(check_in, check_out, '[)') WITH &&
  ) WHERE (status NOT IN ('cancelled'))
);

CREATE TABLE reservation_price_snapshot (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  price_irr       BIGINT NOT NULL,
  plan_id         UUID NOT NULL,
  rate_name       TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reservation_add_ons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  add_on_type    TEXT NOT NULL,
  description_fa TEXT NOT NULL,
  description_en TEXT NOT NULL,
  quantity       INTEGER NOT NULL DEFAULT 1,
  unit_price_irr BIGINT NOT NULL,
  total_price_irr BIGINT NOT NULL,
  date           DATE,
  notes          TEXT
);

-- ─── Services ────────────────────────────────────────────────────────────────

CREATE TABLE services (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category        service_category NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  duration_minutes INTEGER NOT NULL,
  max_capacity    INTEGER NOT NULL,
  min_age         INTEGER,
  requires_advance_booking_hours INTEGER NOT NULL DEFAULT 24,
  requires_deposit BOOLEAN NOT NULL DEFAULT FALSE,
  deposit_pct     NUMERIC(5,2),
  active          BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE service_translations (
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  locale      locale NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  includes    TEXT,
  requirements TEXT,
  meta_title  TEXT,
  meta_desc   TEXT,
  status      translation_status NOT NULL DEFAULT 'incomplete',
  PRIMARY KEY (service_id, locale)
);

CREATE TABLE service_schedules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  weekday     INTEGER NOT NULL, -- 0=Sunday..6=Saturday
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE service_slots (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  start_time  TIME NOT NULL,
  end_time    TIME NOT NULL,
  capacity    INTEGER NOT NULL,
  booked      INTEGER NOT NULL DEFAULT 0,
  status      slot_status NOT NULL DEFAULT 'open',
  price_irr   BIGINT NOT NULL,
  UNIQUE (service_id, date, start_time)
);

CREATE TABLE service_bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_no      TEXT NOT NULL UNIQUE,
  slot_id         UUID NOT NULL REFERENCES service_slots(id),
  guest_id        UUID NOT NULL REFERENCES guests(id),
  reservation_id  UUID REFERENCES reservations(id),
  participants    INTEGER NOT NULL DEFAULT 1,
  status          reservation_status NOT NULL DEFAULT 'pending',
  total_irr       BIGINT NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at    TIMESTAMPTZ,
  cancelled_at    TIMESTAMPTZ
);

-- ─── Payments ────────────────────────────────────────────────────────────────

CREATE TABLE payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  UUID REFERENCES reservations(id),
  service_booking_id UUID REFERENCES service_bookings(id),
  amount_irr      BIGINT NOT NULL,
  method          payment_method NOT NULL,
  status          payment_status NOT NULL DEFAULT 'pending',
  gateway         TEXT NOT NULL,
  gateway_ref     TEXT,
  gateway_trace   TEXT, -- masked
  idempotency_key TEXT NOT NULL UNIQUE,
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT has_target CHECK (
    (reservation_id IS NOT NULL) != (service_booking_id IS NOT NULL)
    OR (reservation_id IS NOT NULL AND service_booking_id IS NOT NULL)
  )
);

CREATE TABLE payment_attempts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id  UUID NOT NULL REFERENCES payments(id),
  status      payment_status NOT NULL,
  gateway_ref TEXT,
  error_code  TEXT,
  error_msg   TEXT,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refunds (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id  UUID NOT NULL REFERENCES payments(id),
  amount_irr  BIGINT NOT NULL,
  reason      TEXT NOT NULL,
  status      refund_status NOT NULL DEFAULT 'pending',
  gateway_ref TEXT,
  initiated_by UUID NOT NULL REFERENCES users(id),
  processed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Reviews ─────────────────────────────────────────────────────────────────

CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id  UUID NOT NULL UNIQUE REFERENCES reservations(id),
  guest_id        UUID NOT NULL REFERENCES guests(id),
  overall_rating  SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  cleanliness     SMALLINT CHECK (cleanliness BETWEEN 1 AND 5),
  location        SMALLINT CHECK (location BETWEEN 1 AND 5),
  value           SMALLINT CHECK (value BETWEEN 1 AND 5),
  service         SMALLINT CHECK (service BETWEEN 1 AND 5),
  title_fa        TEXT,
  title_en        TEXT,
  body_fa         TEXT NOT NULL,
  body_en         TEXT,
  travel_type     TEXT, -- couples, family, group, solo, wellness
  status          review_status NOT NULL DEFAULT 'pending',
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE review_responses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID NOT NULL UNIQUE REFERENCES reviews(id),
  body_fa     TEXT NOT NULL,
  body_en     TEXT,
  author_id   UUID NOT NULL REFERENCES users(id),
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CMS — Pages & Sections ──────────────────────────────────────────────────

CREATE TABLE pages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL,
  page_type   TEXT NOT NULL,
  status      page_status NOT NULL DEFAULT 'draft',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slug, page_type)
);

CREATE TABLE page_sections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id     UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  visible     BOOLEAN NOT NULL DEFAULT TRUE,
  scheduled_from TIMESTAMPTZ,
  scheduled_to   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE section_versions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id  UUID NOT NULL REFERENCES page_sections(id) ON DELETE CASCADE,
  locale      locale NOT NULL,
  version     INTEGER NOT NULL,
  content     JSONB NOT NULL,
  status      page_status NOT NULL DEFAULT 'draft',
  author_id   UUID REFERENCES users(id),
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (section_id, locale, version)
);

-- ─── SEO ─────────────────────────────────────────────────────────────────────

CREATE TABLE seo_metadata (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id   UUID NOT NULL,
  locale      locale NOT NULL,
  meta_title  TEXT,
  meta_desc   TEXT,
  og_title    TEXT,
  og_desc     TEXT,
  og_image    TEXT,
  canonical   TEXT,
  no_index    BOOLEAN NOT NULL DEFAULT FALSE,
  schema_json JSONB,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (entity_type, entity_id, locale)
);

CREATE TABLE redirects (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path   TEXT NOT NULL UNIQUE,
  to_path     TEXT NOT NULL,
  status_code SMALLINT NOT NULL DEFAULT 301,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Blog ────────────────────────────────────────────────────────────────────

CREATE TABLE blog_categories (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug      TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE blog_category_translations (
  category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  locale      locale NOT NULL,
  name        TEXT NOT NULL,
  PRIMARY KEY (category_id, locale)
);

CREATE TABLE blog_posts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug         TEXT NOT NULL UNIQUE,
  category_id  UUID REFERENCES blog_categories(id),
  author_id    UUID REFERENCES users(id),
  status       page_status NOT NULL DEFAULT 'draft',
  featured     BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE blog_post_translations (
  post_id         UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  locale          locale NOT NULL,
  title           TEXT NOT NULL,
  excerpt         TEXT NOT NULL,
  body            TEXT NOT NULL,
  featured_image  TEXT,
  read_time_mins  INTEGER,
  translation_status translation_status NOT NULL DEFAULT 'incomplete',
  PRIMARY KEY (post_id, locale)
);

CREATE TABLE blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag     TEXT NOT NULL,
  PRIMARY KEY (post_id, tag)
);

-- ─── Media ───────────────────────────────────────────────────────────────────

CREATE TABLE media_assets (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename     TEXT NOT NULL,
  mime_type    TEXT NOT NULL,
  size_bytes   BIGINT NOT NULL,
  width        INTEGER,
  height       INTEGER,
  duration_sec NUMERIC,
  storage_key  TEXT NOT NULL UNIQUE,
  cdn_url      TEXT,
  alt_fa       TEXT,
  alt_en       TEXT,
  uploaded_by  UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── CRM & Marketing ─────────────────────────────────────────────────────────

CREATE TABLE consents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id    UUID REFERENCES guests(id),
  user_id     UUID REFERENCES users(id),
  type        consent_type NOT NULL,
  granted     BOOLEAN NOT NULL,
  channel     TEXT NOT NULL,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE message_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  type        TEXT NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE message_template_versions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES message_templates(id),
  locale      locale NOT NULL,
  version     INTEGER NOT NULL,
  subject     TEXT,
  body_html   TEXT,
  body_text   TEXT NOT NULL,
  variables   TEXT[], -- list of variable names
  active      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (template_id, locale, version)
);

CREATE TABLE campaigns (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  type        campaign_type NOT NULL,
  template_id UUID NOT NULL REFERENCES message_templates(id),
  locale      locale NOT NULL,
  status      campaign_status NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_at     TIMESTAMPTZ,
  stats       JSONB,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE email_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES message_templates(id),
  campaign_id UUID REFERENCES campaigns(id),
  guest_id    UUID REFERENCES guests(id),
  to_email    TEXT NOT NULL,
  subject     TEXT NOT NULL,
  status      TEXT NOT NULL,
  provider_msg_id TEXT,
  error       TEXT,
  sent_at     TIMESTAMPTZ,
  opened_at   TIMESTAMPTZ,
  clicked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sms_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES message_templates(id),
  campaign_id UUID REFERENCES campaigns(id),
  guest_id    UUID REFERENCES guests(id),
  to_phone    TEXT NOT NULL,
  body        TEXT NOT NULL,
  status      TEXT NOT NULL,
  provider_msg_id TEXT,
  error       TEXT,
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Audit & FAQ ─────────────────────────────────────────────────────────────

CREATE TABLE audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID REFERENCES users(id),
  actor_email TEXT,
  action      TEXT NOT NULL,
  entity_type TEXT,
  entity_id   UUID,
  before_json JSONB,
  after_json  JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE faqs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug       TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE faq_translations (
  faq_id   UUID NOT NULL REFERENCES faqs(id) ON DELETE CASCADE,
  locale   locale NOT NULL,
  question TEXT NOT NULL,
  answer   TEXT NOT NULL,
  status   translation_status NOT NULL DEFAULT 'incomplete',
  PRIMARY KEY (faq_id, locale)
);

CREATE TABLE integration_settings (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key      TEXT NOT NULL UNIQUE,
  value    TEXT NOT NULL, -- encrypted where sensitive
  secret   BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires ON sessions(expires_at) WHERE revoked_at IS NULL;
CREATE INDEX idx_login_attempts_email_time ON login_attempts(email, created_at);
CREATE INDEX idx_reservations_guest ON reservations(guest_id);
CREATE INDEX idx_reservations_unit ON reservations(unit_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in, check_out);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_no ON reservations(reservation_no);
CREATE INDEX idx_inventory_date ON inventory(date);
CREATE INDEX idx_booking_holds_expires ON booking_holds(expires_at);
CREATE INDEX idx_service_slots_date ON service_slots(date, service_id);
CREATE INDEX idx_payments_reservation ON payments(reservation_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_blog_posts_published ON blog_posts(published_at) WHERE status = 'published';
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_email_logs_guest ON email_logs(guest_id);
CREATE INDEX idx_sms_logs_guest ON sms_logs(guest_id);

-- ─── Seed: Roles ─────────────────────────────────────────────────────────────

INSERT INTO roles (name, description, is_system) VALUES
  ('super_admin', 'Full system access', TRUE),
  ('general_manager', 'Resort general manager', TRUE),
  ('reservation_manager', 'Manage all reservations', TRUE),
  ('front_desk', 'Check-in, check-out, basic reservations', TRUE),
  ('content_manager', 'Manage all CMS content', TRUE),
  ('content_editor', 'Edit drafts, cannot publish', TRUE),
  ('translator', 'Edit translations only', TRUE),
  ('marketing_manager', 'CRM, campaigns, analytics', TRUE),
  ('crm_operator', 'Email and SMS campaigns', TRUE),
  ('finance_manager', 'Payments, refunds, reports', TRUE),
  ('operations_manager', 'Housekeeping, capacity, staff schedule', TRUE),
  ('experience_manager', 'Services and experiences', TRUE),
  ('restaurant_manager', 'Restaurant and café', TRUE),
  ('customer_support', 'View reservations, respond to reviews', TRUE),
  ('read_only_auditor', 'Read-only access to all data', TRUE);

-- ─── Seed: System FAQ slugs ───────────────────────────────────────────────────

INSERT INTO faqs (slug, sort_order) VALUES
  ('location-and-access', 1),
  ('how-to-book', 2),
  ('private-pool-units', 3),
  ('check-in-check-out', 4),
  ('unit-capacity', 5),
  ('family-suitability', 6),
  ('massage-and-yoga', 7),
  ('atv-and-horse-riding', 8),
  ('restaurant-policy', 9),
  ('pool-seasons', 10),
  ('cancellation-policy', 11),
  ('breakfast-included', 12),
  ('parking-and-wifi', 13),
  ('pet-policy', 14),
  ('private-events', 15),
  ('payment-security', 16);

COMMIT;
