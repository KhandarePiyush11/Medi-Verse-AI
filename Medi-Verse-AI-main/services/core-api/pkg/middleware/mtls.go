package middleware

import (
	"context"
	"crypto/x509"
	"errors"
	"net/http"
	"strings"
)

type contextKey string

const (
	TenantIDKey contextKey = "tenant_id"
	UserRoleKey contextKey = "user_role"
	MCIIDKey    contextKey = "mci_id"
)

// MTLSMiddleware verifies incoming client TLS certificates for mTLS compliance.
func MTLSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		// Verify TLS connection state if TLS is enabled
		if r.TLS != nil && len(r.TLS.PeerCertificates) > 0 {
			clientCert := r.TLS.PeerCertificates[0]
			tenantID, err := extractTenantFromCert(clientCert)
			if err != nil {
				http.Error(w, "Invalid Client Certificate: "+err.Error(), http.StatusUnauthorized)
				return
			}
			ctx = context.WithValue(ctx, TenantIDKey, tenantID)
		} else {
			// Fallback header parsing for proxy-terminated mTLS environments
			tenantHeader := r.Header.Get("X-Tenant-ID")
			if tenantHeader != "" {
				ctx = context.WithValue(ctx, TenantIDKey, tenantHeader)
			} else {
				// Default development fallback tenant
				ctx = context.WithValue(ctx, TenantIDKey, "00000000-0000-0000-0000-000000000001")
			}
		}

		userRole := r.Header.Get("X-User-Role")
		if userRole != "" {
			ctx = context.WithValue(ctx, UserRoleKey, userRole)
		} else {
			ctx = context.WithValue(ctx, UserRoleKey, "DOCTOR")
		}

		mciID := r.Header.Get("X-MCI-NMC-ID")
		if mciID != "" {
			ctx = context.WithValue(ctx, MCIIDKey, mciID)
		}

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func extractTenantFromCert(cert *x509.Certificate) (string, error) {
	// Parse Subject Organizational Unit or SAN URI for Tenant ID
	for _, ou := range cert.Subject.OrganizationalUnit {
		if strings.HasPrefix(ou, "Tenant:") {
			return strings.TrimPrefix(ou, "Tenant:"), nil
		}
	}
	if len(cert.DNSNames) > 0 {
		return cert.DNSNames[0], nil
	}
	return "", errors.New("missing Tenant ID in client certificate SAN/OU")
}
