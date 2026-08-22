# NEURO-SYNAPSE HEALTH OS — Antigravity Agent Context & Rules

## Project Overview
- **Codename**: NEURO-SYNAPSE HEALTH OS
- **Domain**: Enterprise Health-Tech & SaMD Platform (ABDM-Compliant Hospital HIS/EMR + Consumer Health Gateway + CDSS)
- **Monorepo Architecture**: Turborepo
  - `/apps/web-hospital`: React 19 SPA (Doctor Cockpit, DICOM WebGPU Viewer, Front Desk)
  - `/apps/web-consumer`: Next.js 15 SSR (B2C Gateway, Outbreak Heatmap, ABHA Portal)
  - `/services/core-api`: Go 1.23 + Chi + pgx + HAPI FHIR R4 Connector + ABDM HIECM
  - `/services/ai-engine`: FastAPI + PyTorch + MONAI + Bio-BERT + Triton Client

---

## Architectural & Security Guardrails (HARD CONSTRAINTS)

1. **Deterministic Multi-Tenancy (Zero Leakage)**:
   - EVERY PostgreSQL query MUST execute within a transaction where `SET LOCAL app.current_tenant_id = '<tenant_uuid>'` is invoked.
   - All database tables MUST include `tenant_id UUID NOT NULL` and be bound to PostgreSQL 16 Row-Level Security (RLS) policies. Direct un-scoped database queries are strictly prohibited.

2. **SaMD CDSS Human-in-the-Loop Isolation**:
   - AI models (MONAI Swin UNETR 3D, Bio-BERT, Derm classifiers) function strictly as Clinical Decision Support Systems (CDSS).
   - Endpoints MUST return structured findings containing confidence metrics, Grad-CAM saliency maps, and differential diagnostic percentages.
   - The system MUST NEVER commit an autonomous prescription or final diagnosis without a cryptographic signature from a verified clinician (MCI/NMC ID).

3. **Zero-Footprint PACS DICOM Rendering**:
   - DICOM frames must stream via DICOMweb (WADO-RS) directly to client-side WebGPU/CornerstoneJS canvas.
   - Raw `.dcm` files MUST NEVER be saved or cached locally on client workstations.

4. **ABDM & DPDP Sovereign Compliance**:
   - Patient health records MUST strictly map to FHIR R4 resources (`Patient`, `Observation`, `DiagnosticReport`, `MedicationRequest`).
   - Consent tokens MUST be validated against ABDM HIECM specs prior to unlocking cross-hospital health records.
   - All data at rest MUST be encrypted with AES-256; all data in transit MUST enforce mTLS / TLS 1.3; immutable audit logs MUST record every patient data access event.

---

## Technical Stack & Design System
- **Colors**:
  - Deep Slate Void: `#070A11`
  - Clinical Cyan: `#00F2FE`
  - Bio-Teal: `#4FACFE`
  - Surgical White: `#F8FAFC`
  - Critical Amber / Hazard Red: `#FF4560`
- **Data Standards**: HL7 FHIR R4, ABDM (M1, M2, M3), DICOMweb (Orthanc / WADO-RS), LOINC, SNOMED-CT.
