package middleware

import (
	"context"
	"fmt"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

type DBKey string

const PoolContextKey DBKey = "db_pool"

// RLSMiddleware sets `SET LOCAL app.current_tenant_id = '...'` for every database transaction.
func RLSMiddleware(dbPool *pgxpool.Pool) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tenantIDVal := r.Context().Value(TenantIDKey)
			tenantID, ok := tenantIDVal.(string)
			if !ok || tenantID == "" {
				http.Error(w, "Unauthorized: Missing Tenant Context", http.StatusForbidden)
				return
			}

			// Store dbPool in context for handlers
			ctx := context.WithValue(r.Context(), PoolContextKey, dbPool)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// ExecuteWithRLS executes a function inside a transaction with RLS app.current_tenant_id bound.
func ExecuteWithRLS(ctx context.Context, pool *pgxpool.Pool, fn func(txTx interface{}) error) error {
	tenantID, _ := ctx.Value(TenantIDKey).(string)
	if tenantID == "" {
		return fmt.Errorf("RLS execution failed: tenant_id missing from context")
	}

	// Begin transaction and execute SET LOCAL app.current_tenant_id
	tx, err := pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, "SELECT set_tenant_context($1)", tenantID)
	if err != nil {
		return fmt.Errorf("failed to set RLS tenant context: %w", err)
	}

	if err := fn(tx); err != nil {
		return err
	}

	return tx.Commit(ctx)
}
