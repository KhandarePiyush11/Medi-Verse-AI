-- ============================================================================
-- NEURO-SYNAPSE HEALTH OS — PostgreSQL 16 Multi-Tenant RLS Schema & DDL
-- Database Migration 000001_init_schema.up.sql
-- Security Constraints: Mandatory Row-Level Security (RLS) bound to app.current_tenant_id
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper Function: Set Tenant Session Context for RLS
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id UUID) 
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', p_tenant_id::TEXT, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Tenants Table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    abdm_facility_id VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Users Table (Doctors, Nurses, Reception, Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('DOCTOR', 'NURSE', 'RECEPTION', 'ADMIN', 'PATIENT')),
    full_name VARCHAR(255) NOT NULL,
    mci_nmc_id VARCHAR(100), -- Medical Council Registration ID for Doctors
    public_key_pem TEXT, -- For ABDM M3 digital signature verification
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_tenant_email_key UNIQUE (tenant_id, email)
);

-- 3. Patients Table (FHIR & ABDM ABHA Mapped)
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    fhir_id VARCHAR(100) NOT NULL,
    abha_id VARCHAR(100) UNIQUE,
    abha_address VARCHAR(100) UNIQUE,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('MALE', 'FEMALE', 'OTHER', 'UNKNOWN')),
    birth_date DATE NOT NULL,
    phone VARCHAR(20),
    address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT patients_tenant_fhir_key UNIQUE (tenant_id, fhir_id)
);

-- 4. Encounters Table (OPD / IPD Visits)
CREATE TABLE IF NOT EXISTS encounters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    fhir_id VARCHAR(100) NOT NULL,
    practitioner_id UUID REFERENCES users(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    class_code VARCHAR(50) NOT NULL DEFAULT 'AMB', -- AMB (Ambulatory), IMP (Inpatient)
    period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Prescriptions Table (Rx Scribe + Cryptographic Signature)
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    practitioner_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('DRAFT', 'SIGNED', 'CANCELLED', 'DISPENSED')),
    medication_code VARCHAR(100) NOT NULL, -- RxNorm / SNOMED CT
    medication_name VARCHAR(255) NOT NULL,
    dosage_instruction JSONB NOT NULL,
    doctor_signature TEXT, -- Cryptographic RSA/ECDSA signature using MCI/NMC ID
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. CDSS AI Findings Table (Human-in-the-Loop SaMD Isolation)
CREATE TABLE IF NOT EXISTS cdss_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    encounter_id UUID NOT NULL REFERENCES encounters(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    model_name VARCHAR(100) NOT NULL, -- e.g., Swin-UNETR-3D, Bio-BERT-Lab, Derm-ResNet
    model_version VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5,4) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
    saliency_map_url TEXT,
    differential_dx JSONB NOT NULL, -- JSON array of differential diagnostic percentages
    doctor_approval_status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (doctor_approval_status IN ('PENDING', 'APPROVED', 'REJECTED', 'MODIFIED')),
    signed_by_doctor_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Immutable Audit Logs Table (DPDP Compliance & Security)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES ENFORCEMENT
-- ============================================================================

-- Enable RLS on all tenant-isolated tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users FORCE ROW LEVEL SECURITY;

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients FORCE ROW LEVEL SECURITY;

ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters FORCE ROW LEVEL SECURITY;

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions FORCE ROW LEVEL SECURITY;

ALTER TABLE cdss_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cdss_findings FORCE ROW LEVEL SECURITY;

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs FORCE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY users_tenant_isolation ON users
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY patients_tenant_isolation ON patients
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY encounters_tenant_isolation ON encounters
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY prescriptions_tenant_isolation ON prescriptions
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY cdss_findings_tenant_isolation ON cdss_findings
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

CREATE POLICY audit_logs_tenant_isolation ON audit_logs
    USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);

-- Indexes for High Performance Queries
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_patients_tenant_fhir ON patients(tenant_id, fhir_id);
CREATE INDEX idx_patients_abha ON patients(abha_id);
CREATE INDEX idx_encounters_tenant_patient ON encounters(tenant_id, patient_id);
CREATE INDEX idx_prescriptions_tenant_encounter ON prescriptions(tenant_id, encounter_id);
CREATE INDEX idx_cdss_findings_tenant_encounter ON cdss_findings(tenant_id, encounter_id);
CREATE INDEX idx_audit_logs_tenant_created ON audit_logs(tenant_id, created_at);
