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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, backgroundColor: '#10131b', color: '#e0e2ed', fontFamily: "'Geist', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
