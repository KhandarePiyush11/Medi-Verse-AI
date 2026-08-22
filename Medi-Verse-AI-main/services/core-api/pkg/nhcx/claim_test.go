package nhcx

import (
	"context"
	"testing"
)

func TestProcessNHCXPreAuth_Success(t *testing.T) {
	gateway := NewNHCXGateway("", "HFR-MAX-DELHI-001")

	claim := &FHIRClaim{
		Status: "active",
		Use:    "preauthorization",
	}
	claim.Patient.Reference = "Patient/fhir-p-1001"
	claim.Total.Value = 350000.0

	ctx := context.Background()
	resp, err := gateway.ProcessNHCXPreAuth(ctx, claim)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if resp.ResourceType != "ClaimResponse" {
		t.Errorf("Expected ResourceType 'ClaimResponse', got %s", resp.ResourceType)
	}

	if resp.Outcome != "complete" {
		t.Errorf("Expected Outcome 'complete', got %s", resp.Outcome)
	}

	if resp.Payment.Amount != 350000.0 {
		t.Errorf("Expected Payment Amount 350000.0, got %f", resp.Payment.Amount)
	}

	if resp.Payment.Currency != "INR" {
		t.Errorf("Expected Payment Currency 'INR', got %s", resp.Payment.Currency)
	}
}

func TestProcessNHCXPreAuth_MissingPatient(t *testing.T) {
	gateway := NewNHCXGateway("", "HFR-MAX-DELHI-001")

	claim := &FHIRClaim{
		Status: "active",
	}
	// Missing Patient Reference

	ctx := context.Background()
	_, err := gateway.ProcessNHCXPreAuth(ctx, claim)

	if err == nil {
		t.Fatal("Expected error for missing patient reference, got nil")
	}
}
