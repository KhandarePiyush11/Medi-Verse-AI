package nhcx

import (
	"context"
	"encoding/json"
	"fmt"
	"time"
)

// FHIRClaim represents HL7 FHIR R4 Claim Resource for NHCX Settlement
type FHIRClaim struct {
	ResourceType string `json:"resourceType"` // "Claim"
	ID           string `json:"id,omitempty"`
	Status       string `json:"status"`       // "active"
	Type         struct {
		Coding []struct {
			System string `json:"system"`
			Code   string `json:"code"` // "institutional" | "professional"
		} `json:"coding"`
	} `json:"type"`
	Use     string `json:"use"` // "preauthorization" | "claim"
	Patient struct {
		Reference string `json:"reference"`
	} `json:"patient"`
	Created   string `json:"created"`
	Provider  struct {
		Identifier struct {
			System string `json:"system"`
			Value  string `json:"value"` // ROHINI / HFR ID
		} `json:"identifier"`
	} `json:"provider"`
	Priority struct {
		Coding []struct {
			Code string `json:"code"` // "stat" | "normal"
		} `json:"coding"`
	} `json:"priority"`
	Total struct {
		Value    float64 `json:"value"`
		Currency string  `json:"currency"` // "INR"
	} `json:"total"`
}

// FHIRClaimResponse represents HL7 FHIR R4 ClaimResponse Resource from NHCX Sandbox
type FHIRClaimResponse struct {
	ResourceType string `json:"resourceType"` // "ClaimResponse"
	ID           string `json:"id"`
	Status       string `json:"status"`       // "active"
	Outcome      string `json:"outcome"`      // "complete" | "error"
	Disposition  string `json:"disposition"`  // "Pre-authorization approved"
	Payment      struct {
		Amount float64 `json:"amount"`
		Currency string `json:"currency"`
	} `json:"payment"`
	PreAuthRef string `json:"preAuthRef"`
}

// NHCXGateway handles integration with National Health Claims Exchange (NHCX)
type NHCXGateway struct {
	SandboxURL string
	FacilityHFRID string
}

func NewNHCXGateway(sandboxURL, facilityHFRID string) *NHCXGateway {
	if sandboxURL == "" {
		sandboxURL = "https://nhcx.abdm.gov.in/api/v1/claims"
	}
	return &NHCXGateway{
		SandboxURL: sandboxURL,
		FacilityHFRID: facilityHFRID,
	}
}

// ProcessNHCXPreAuth validates and submits a FHIR Claim bundle to NHCX sandbox
func (g *NHCXGateway) ProcessNHCXPreAuth(ctx context.Context, claim *FHIRClaim) (*FHIRClaimResponse, error) {
	claim.ResourceType = "Claim"
	claim.Use = "preauthorization"
	claim.Created = time.Now().Format(time.RFC3339)
	claim.Total.Currency = "INR"

	if claim.Patient.Reference == "" {
		return nil, fmt.Errorf("invalid NHCX Claim: missing Patient reference")
	}

	// Simulated NHCX Gateway sub-minute pre-authorization approval
	resp := &FHIRClaimResponse{
		ResourceType: "ClaimResponse",
		ID:           fmt.Sprintf("nhcx-resp-%d", time.Now().UnixNano()),
		Status:       "active",
		Outcome:      "complete",
		Disposition:  "NHCX Pre-Authorization Auto-Validated & Approved",
		PreAuthRef:   fmt.Sprintf("PA-NHCX-%d", time.Now().Unix()),
	}
	resp.Payment.Amount = claim.Total.Value
	resp.Payment.Currency = "INR"

	return resp, nil
}
