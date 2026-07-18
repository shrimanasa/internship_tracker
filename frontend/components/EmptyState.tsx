'use client';

import React from 'react';
import { Inbox, Search, FileText, Calendar, Bell } from 'lucide-react';

type EmptyStateVariant = 'default' | 'search' | 'documents' | 'interviews' | 'reminders';

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const VARIANT_CONFIG: Record<EmptyStateVariant, { icon: React.ElementType; defaultTitle: string; defaultDesc: string }> = {
  default: {
    icon: Inbox,
    defaultTitle: 'Nothing here yet',
    defaultDesc: 'Get started by creating your first entry.',
  },
  search: {
    icon: Search,
    defaultTitle: 'No results found',
    defaultDesc: 'Try adjusting your search or filter criteria.',
  },
  documents: {
    icon: FileText,
    defaultTitle: 'No documents uploaded',
    defaultDesc: 'Upload your resume, certificates, or cover letters to get started.',
  },
  interviews: {
    icon: Calendar,
    defaultTitle: 'No interviews scheduled',
    defaultDesc: 'Once you apply to internships, schedule your interviews here.',
  },
  reminders: {
    icon: Bell,
    defaultTitle: 'No reminders set',
    defaultDesc: 'Create reminders for deadlines and follow-ups.',
  },
};

export default function EmptyState({ variant = 'default', title, description, actionLabel, onAction }: EmptyStateProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: 'rgba(236, 72, 153, 0.06)',
        border: '1px solid rgba(236, 72, 153, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon size={24} color="#ec4899" strokeWidth={1.5} />
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
        {title || config.defaultTitle}
      </h3>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, maxWidth: 320 }}>
        {description || config.defaultDesc}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: 20,
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #ec4899, #db2777)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
