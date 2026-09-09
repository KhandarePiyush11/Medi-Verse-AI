import React from 'react';

export const metadata = {
  title: 'NEUROSYNAPSE HEALTH OS — B2C Sovereign Health Gateway',
  description: 'AI-Powered ABDM Health Records, Spatial Epidemiological Outbreak Radar & Instant Doctor Booking',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body style={{ margin: 0, backgroundColor: '#10131b', color: '#e0e2ed', fontFamily: "'Geist', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
