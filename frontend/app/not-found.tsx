'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fff5f7, #fce7f3)',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <h1 style={{ fontSize: 72, fontWeight: 800, color: '#ec4899', margin: 0 }}>404</h1>
      <p style={{ fontSize: 18, color: '#64748b', margin: '8px 0 24px' }}>Page not found</p>
      <Link href="/" style={{
        padding: '12px 24px',
        background: 'linear-gradient(135deg, #ec4899, #db2777)',
        color: 'white',
        borderRadius: 14,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: 14,
      }}>
        Go Home
      </Link>
    </div>
  );
}
