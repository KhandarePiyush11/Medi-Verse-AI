import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#10131b', color: '#e0e2ed', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 800, color: '#00f2fe', margin: '0 0 16px 0' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#849495', marginBottom: '24px' }}>The requested clinical route could not be found.</p>
      <Link href="/" style={{ padding: '10px 24px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f2fe 0%, #3196e6 100%)', color: '#00373a', fontWeight: 800, textDecoration: 'none' }}>
        Return to Gateway
      </Link>
    </div>
  );
}
