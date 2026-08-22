import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add app directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../app')))

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["cdsco_mdr_2017"] == "CLASS_C_MD9_COMPLIANT"

def test_cdss_segmentation_samd_md9_audit():
    headers = {
        "X-Tenant-ID": "tenant-max-delhi-001",
        "X-Doctor-NMC-Stamp": "STAMP-MCI-884920-RSA2048"
    }
    response = client.post("/api/v1/cdss/segmentation?wado_study_uid=1.2.840.113619.2.55", headers=headers)
    assert response.status_code == 200
    data = response.json()
    
    assert data["finding_id"] == "cdss-seg-9941"
    assert data["confidence_score"] == 0.994
    assert data["autonomous_prescription_allowed"] is False
    assert data["doctor_cryptographic_signature_required"] is True
    
    # CDSCO MDR 2017 Form MD-9 Audit Payload assertions
    audit = data["cdsco_audit_payload"]
    assert "Form MD-9 License #CDSCO-SaMD-2024-8849" in audit["cdsco_licensing_status"]
    assert audit["model_version"] == "MONAI-Swin-UNETR-v4.2-CDSCO-ClassC"
    assert audit["confidence_interval"] == [0.962, 0.998]
    assert audit["x_doctor_nmc_stamp"] == "STAMP-MCI-884920-RSA2048"

def test_lab_ocr_loinc_normalization():
    payload = {
        "raw_lab_text": "Serum Creatinine: 2.4 mg/dL\neGFR: 28 mL/min",
        "patient_id": "p-1001"
    }
    response = client.post("/api/v1/cdss/lab-ocr", json=payload)
    assert response.status_code == 200
    results = response.json()
    assert len(results) == 2
    assert results[0]["loinc_code"] == "2160-0"
    assert results[0]["flag"] == "CRITICAL"
    assert results[0]["cdsco_md9_verified"] is True

def test_outbreak_telemetry_dengue_surge():
    payload = {
        "latitude": 28.6139,
        "longitude": 77.2090,
        "symptoms": ["HIGH_FEVER", "THROMBOCYTOPENIA", "JOINT_PAIN"],
        "district_code": "DELHI_NCR_01"
    }
    response = client.post("/api/v1/cdss/outbreak-telemetry", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["disease_cluster"] == "Dengue Serotype-2"
    assert data["relative_risk_ratio"] == 3.42
    assert data["idsp_baseline_exceeded"] is True
    assert data["recommended_alert_level"] == "RED"
