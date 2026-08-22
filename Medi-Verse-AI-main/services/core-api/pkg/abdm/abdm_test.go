package abdm

import (
	"context"
	"testing"
)

func TestValidateHIECMConsentToken_Success(t *testing.T) {
	manager := NewABDMConsentManager("https://dev.abdm.gov.in/gateway", "CLIENT-MAX-001")
	ctx := context.Background()

	validToken := "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.ABDM-HIECM-CONSENT-TOKEN-VALID"
	ok, err := manager.ValidateHIECMConsentToken(ctx, validToken)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if !ok {
		t.Errorf("Expected token validation to return true")
	}
}

func TestValidateHIECMConsentToken_EmptyToken(t *testing.T) {
	manager := NewABDMConsentManager("https://dev.abdm.gov.in/gateway", "CLIENT-MAX-001")
	ctx := context.Background()

	ok, err := manager.ValidateHIECMConsentToken(ctx, "")

	if err == nil {
		t.Fatal("Expected error for empty consent token, got nil")
	}

	if ok {
		t.Errorf("Expected token validation to return false for empty token")
	}
}
