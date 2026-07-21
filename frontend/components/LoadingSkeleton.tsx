'use client';

import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width = '100%', height = '20px', borderRadius = '12px', className = '' }: SkeletonProps) {
  return (
    <div
      className={className}
      aria-busy="true"
      aria-label="Loading content"
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(236,72,153,0.06) 25%, rgba(236,72,153,0.12) 50%, rgba(236,72,153,0.06) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite ease-in-out',
      }}
    />
  );
}


export function DashboardCardSkeleton() {
  return (
    <div style={{
      padding: '24px',
      borderRadius: '20px',
      background: 'rgba(255,255,255,0.6)',
      border: '1px solid rgba(236,72,153,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      <Skeleton width="40px" height="40px" borderRadius="14px" />
      <Skeleton width="60%" height="14px" />
      <Skeleton width="40%" height="28px" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: '12px 16px' }}>
          <Skeleton width={`${60 + Math.random() * 30}%`} height="16px" />
        </td>
      ))}
    </tr>
  );
}
