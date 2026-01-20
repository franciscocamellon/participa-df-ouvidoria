-- =====================================================================
-- V1 - Initial schema for PostgreSQL
-- =====================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =======================
-- PROTOCOL NUMBER SEQUENCE
-- =======================
CREATE SEQUENCE IF NOT EXISTS ombudsman_protocol_seq START 1;

-- =======================
-- USERS TABLE
-- =======================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(150) NOT NULL,
    email_verified_at TIMESTAMP(3),

    password_hash VARCHAR(255) NOT NULL,
    phone_e164 VARCHAR(20),

    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',

    failed_login_attempts INTEGER NOT NULL DEFAULT 0 CHECK (failed_login_attempts >= 0),
    locked_until TIMESTAMPTZ(3),
    last_login_at TIMESTAMPTZ(3),

    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMPTZ(3) NULL,

    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('CUSTOMER', 'ADMIN', 'AGENT')),
    CONSTRAINT chk_users_status CHECK (status IN ('PENDING', 'ACTIVE', 'DISABLED'))
);

CREATE INDEX idx_users_status ON users(status);

-- =======================
-- PASSWORD_RESET_TOKENS
-- =======================

CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token VARCHAR(100) NOT NULL,
    user_id UUID NOT NULL,
    expires_at TIMESTAMPTZ(3) NOT NULL,
    used_at TIMESTAMPTZ(3),
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT uq_password_reset_tokens_token UNIQUE (token),
    CONSTRAINT fk_password_reset_tokens_user
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);

-- =======================
-- OMBUDSMAN TABLE (FIXED)
--  - Aligns with:
--    Ombudsman (@Entity)
--    Location (@Embeddable)  -> longitude/latitude NOT NULL
--    IzaTriageResult (@Embeddable) -> iza_* columns (including iza_confidence)
--    attachmentIds (@ElementCollection) -> ombudsman_attachment_ids
--    statusHistory (@ElementCollection + @OrderColumn(stage)) -> ombudsman_status_history
-- =======================

CREATE TABLE ombudsman (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    protocol_number varchar(30) NOT NULL,

    category varchar(50) NOT NULL,
    description varchar(4000) NOT NULL,
    urgency varchar(50),
    current_status varchar(50) DEFAULT 'RECEIVED',

    anonymous boolean,
    privacy_consent boolean NOT NULL,

    destination_agency_id uuid,
    reporter_identity_id uuid,

    iza_triage_result_id uuid,

    iza_suggested_category varchar(50),
    iza_suggested_agency_id uuid,
    iza_confidence numeric(5,4),
    iza_rationale varchar(2000),

    longitude numeric(9,6) NOT NULL,
    latitude numeric(9,6) NOT NULL,
    approx_address varchar(255),

    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT chk_ombudsman_longitude_range CHECK (longitude >= -180 AND longitude <= 180),
    CONSTRAINT chk_ombudsman_latitude_range CHECK (latitude >= -90 AND latitude <= 90)
);

-- attachmentIds (@ElementCollection List<UUID>)
CREATE TABLE ombudsman_attachment_urls (
    ombudsman_id uuid NOT NULL REFERENCES ombudsman(id) ON DELETE CASCADE,
    stage integer NOT NULL,
    attachment_url varchar(500) NOT NULL,
    PRIMARY KEY (ombudsman_id, stage)
);

-- statusHistory (@ElementCollection List<StatusHistoryEntry> + @OrderColumn(stage))
CREATE TABLE ombudsman_status_history (
    ombudsman_id uuid NOT NULL REFERENCES ombudsman(id) ON DELETE CASCADE,
    stage integer NOT NULL,
    status varchar(50) NOT NULL,
    changed_at TIMESTAMPTZ(3) NOT NULL,
    note varchar(1000),
    changed_by_user_id uuid,
    PRIMARY KEY (ombudsman_id, stage)
);

-- index_for_search (btree)
CREATE UNIQUE INDEX ux_ombudsman_protocol_number ON ombudsman (protocol_number);
CREATE INDEX idx_ombudsman_category ON ombudsman (category);
CREATE INDEX idx_ombudsman_urgency ON ombudsman (urgency);
CREATE INDEX idx_ombudsman_current_status ON ombudsman (current_status);

-- description index_for_search (full-text)
CREATE INDEX idx_ombudsman_description_tsv
    ON ombudsman USING gin (to_tsvector('simple', description));

-- ============================
-- OMBUDSMAN ATTACHMENTS TABLE
-- (Entity Attachment - kept as you had)
-- ============================

CREATE TABLE ombudsman_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    original_file_name VARCHAR(255),
    size_bytes BIGINT NOT NULL CHECK (size_bytes >= 0),
    storage_key_or_url VARCHAR(500) NOT NULL,
    accessibility_description VARCHAR(500),
    transcript VARCHAR(8000),
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS ombudsman_attachments_case_id_idx
    ON ombudsman_attachments (case_id);

-- index_for_search (transcript)
CREATE INDEX IF NOT EXISTS ombudsman_attachments_transcript_trgm_idx
    ON ombudsman_attachments USING GIN (transcript gin_trgm_ops);

-- ============================
-- REPORTER IDENTITY TABLE
-- (kept as you had)
-- ============================

CREATE TABLE reporter_identity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL,
    full_name VARCHAR(200),
    email VARCHAR(150),
    phone_number VARCHAR(20),
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

-- Requested: fullName index_for_search
CREATE INDEX idx_reporter_identity_full_name_search
    ON reporter_identity (lower(full_name));

-- ==============================
-- CASE STATUS HISTORY TABLE
-- (kept as you had)
-- ==============================

CREATE TABLE IF NOT EXISTS case_status_history_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL,
    status VARCHAR(30) NOT NULL,
    changed_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    note VARCHAR(1000),
    changed_by_user_id UUID,
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS idx_case_status_history_entries_status_trgm
    ON case_status_history_entries
    USING GIN (lower(status) gin_trgm_ops);

-- ==============================
-- DESTINATION AGENCIES TABLE
-- ==============================

CREATE TABLE destination_agencies (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    acronym VARCHAR(30),
    active BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

-- Indexes for search (case-insensitive)
CREATE INDEX idx_destination_agencies_name_search
    ON destination_agencies (lower(name));

CREATE INDEX idx_destination_agencies_acronym_search
    ON destination_agencies (lower(acronym));

-- ==============================
-- IZA TRIAGE RESULTS TABLE
-- (kept as you had; separate from embedded iza_* columns)
-- ==============================

CREATE TABLE iza_triage_results (
    id uuid primary key DEFAULT gen_random_uuid(),
    case_id uuid not null,
    suggested_category varchar(255),
    suggested_agency_id uuid,
    confidence numeric(5,4),
    rationale varchar(2000),
    created_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE INDEX IF NOT EXISTS idx_iza_triage_results_suggested_category
    ON iza_triage_results (suggested_category);

CREATE INDEX IF NOT EXISTS idx_iza_triage_results_confidence
    ON iza_triage_results (confidence);

-- =======================
-- SEED DATA (AUTH TESTS)
-- =======================
-- Passwords (raw) para referência:
-- ADMIN:   Admin@123!
-- Maria:   Maria@123!
-- João:    Joao@123!

INSERT INTO users (
    full_name,
    email,
    password_hash,
    role,
    status,
    email_verified_at,
    failed_login_attempts,
    locked_until,
    last_login_at,
    phone_e164,
    created_at,
    updated_at
) VALUES
      (
          'Francisco Admin',
          'admin@softkit.local',
          '$2b$10$UvXMaTA8FWWUz99b/UZnxOyOQSFwUpgakYJnW98z159iac9WYNmBy',
          'ADMIN',
          'ACTIVE',
          CURRENT_TIMESTAMP(3) - INTERVAL '60 days',
          0,
          NULL,
          CURRENT_TIMESTAMP(3) - INTERVAL '1 day',
          '+5511999990001',
          CURRENT_TIMESTAMP(3) - INTERVAL '60 days',
          CURRENT_TIMESTAMP(3) - INTERVAL '1 day'
      ),
      (
          'Maria Souza',
          'maria@softkit.local',
          '$2b$10$rwMT1bd2jLeApPdIqwBwd.h2m.2cuBVzx4eyppFRl076J05./zMxS',
          'CUSTOMER',
          'ACTIVE',
          CURRENT_TIMESTAMP(3) - INTERVAL '20 days',
          0,
          NULL,
          CURRENT_TIMESTAMP(3) - INTERVAL '2 days',
          '+5511999990002',
          CURRENT_TIMESTAMP(3) - INTERVAL '20 days',
          CURRENT_TIMESTAMP(3) - INTERVAL '2 days'
      ),
      (
          'João Pereira',
          'joao@softkit.local',
          '$2b$10$1d62QlVAwQA5DtWhfZuc9OIe8mtQf0D3a.HdmBkg.3gXWFvutU/7S',
          'AGENT',
          'ACTIVE',
          CURRENT_TIMESTAMP(3) - INTERVAL '20 days',
          0,
          NULL,
          CURRENT_TIMESTAMP(3) - INTERVAL '4 days',
          NULL,
          CURRENT_TIMESTAMP(3) - INTERVAL '3 days',
          CURRENT_TIMESTAMP(3) - INTERVAL '3 days'
      );
