// lib/dates.ts: Centralized date formatting utilities for InternTrack

/**
 * Format a date string to a human-readable short format.
 * Example: "2026-07-18" -> "Jul 18, 2026"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format a date string to include time.
 * Example: "2026-07-18T14:30:00" -> "Jul 18, 2026 at 2:30 PM"
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns a relative time string like "2 days ago", "in 3 hours".
 */
export function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const absDiff = Math.abs(diffMs);
    const isFuture = diffMs < 0;

    const minutes = Math.floor(absDiff / 60000);
    const hours = Math.floor(absDiff / 3600000);
    const days = Math.floor(absDiff / 86400000);

    let label: string;
    if (minutes < 1) label = 'just now';
    else if (minutes < 60) label = `${minutes}m`;
    else if (hours < 24) label = `${hours}h`;
    else if (days < 30) label = `${days}d`;
    else label = formatDate(dateString);

    if (label === 'just now') return label;
    return isFuture ? `in ${label}` : `${label} ago`;
  } catch {
    return dateString;
  }
}

/**
 * Check if a deadline date has passed.
 */
export function isOverdue(dateString: string | null | undefined): boolean {
  if (!dateString) return false;
  try {
    return new Date(dateString) < new Date();
  } catch {
    return false;
  }
}
