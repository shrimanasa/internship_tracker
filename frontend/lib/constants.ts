// Application-wide constants

export const APP_NAME = 'InternTrack';
export const APP_VERSION = '1.1.0';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const STATUS_COLORS: Record<string, string> = {
  'Interested': '#94a3b8',
  'Applied': '#60a5fa',
  'Under Review': '#a78bfa',
  'OA Received': '#f59e0b',
  'Interview Scheduled': '#c084fc',
  'Interview Completed': '#818cf8',
  'Offer Received': '#34d399',
  'Offer Accepted': '#22c55e',
  'Rejected': '#ef4444',
  'Withdrawn': '#9ca3af',
};

export const PRIORITY_COLORS: Record<string, string> = {
  'Low': '#94a3b8',
  'Medium': '#60a5fa',
  'High': '#f59e0b',
  'Critical': '#ef4444',
};
