'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10131b', color: '#e0e2ed', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#f87171', margin: '0 0 16px 0' }}>Clinical Gateway Error</h1>
      <p style={{ fontSize: '15px', color: '#849495', marginBottom: '24px', maxWidth: '500px' }}>{error.message || 'An unexpected error occurred.'}</p>
      <button onClick={() => reset()} style={{ padding: '10px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f2fe 0%, #3196e6 100%)', color: '#00373a', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
        Try again
      </button>
    </div>
  );
}
