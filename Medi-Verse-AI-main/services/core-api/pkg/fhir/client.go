package fhir

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// FHIRClient manages interactions with HAPI FHIR R4 Server
type FHIRClient struct {
	BaseURL    string
	HTTPClient *http.Client
}

type FHIRPatient struct {
	ResourceType string `json:"resourceType"`
	ID           string `json:"id,omitempty"`
	Identifier   []struct {
		System string `json:"system"`
		Value  string `json:"value"`
	} `json:"identifier"`
	Name []struct {
		Text string `json:"text"`
	} `json:"name"`
	Gender    string `json:"gender"`
	BirthDate string `json:"birthDate"`
}

type FHIRMedicationRequest struct {
	ResourceType string `json:"resourceType"`
	ID           string `json:"id,omitempty"`
	Status       string `json:"status"`
	Intent       string `json:"intent"`
	Subject      struct {
		Reference string `json:"reference"`
	} `json:"subject"`
	MedicationCodeableConcept struct {
		Coding []struct {
			System string `json:"system"`
			Code   string `json:"code"`
			Display string `json:"display"`
		} `json:"coding"`
	} `json:"medicationCodeableConcept"`
}

func NewFHIRClient(baseURL string) *FHIRClient {
	if baseURL == "" {
		baseURL = "http://hapi.fhir.org/baseR4"
	}
	return &FHIRClient{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

// CreatePatient posts a Patient resource to HAPI FHIR server
func (c *FHIRClient) CreatePatient(ctx context.Context, p *FHIRPatient) (*FHIRPatient, error) {
	p.ResourceType = "Patient"
	data, err := json.Marshal(p)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", fmt.Sprintf("%s/Patient", c.BaseURL), bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/fhir+json")

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("FHIR API error (%d): %s", resp.StatusCode, string(body))
	}

	var result FHIRPatient
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return &result, nil
}
