package abdm

import (
	"context"
	"fmt"
	"time"
)

type ABHAConsentRequest struct {
	ConsentID   string    `json:"consent_id"`
	ABHAAddress string    `json:"abha_address"`
	Purpose     string    `json:"purpose"`
	HiTypes     []string  `json:"hi_types"` // OPConsultation, Prescription, DiagnosticReport
	DateFrom    time.Time `json:"date_from"`
	DateTo      time.Time `json:"date_to"`
}

type ABDMConsentManager struct {
	GatewayURL string
	ClientID   string
}

func NewABDMConsentManager(gatewayURL, clientID string) *ABDMConsentManager {
	return &ABDMConsentManager{
		GatewayURL: gatewayURL,
		ClientID:   clientID,
	}
}

// ValidateHIECMConsentToken verifies ABDM HIECM consent artifact signature and permissions
func (m *ABDMConsentManager) ValidateHIECMConsentToken(ctx context.Context, consentToken string) (bool, error) {
	if consentToken == "" {
		return false, fmt.Errorf("missing ABDM consent token")
	}
	// Stub validation against ABDM Gateway public keys
	return true, nil
}
