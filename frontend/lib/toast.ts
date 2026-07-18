// lib/toast.ts: Lightweight toast notification utility

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

const TOAST_COLORS: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
  error:   { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
  info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
  warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
};

const TOAST_ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export function showToast({ message, type = 'info', duration = 3500 }: ToastOptions): void {
  if (typeof window === 'undefined') return;

  const colors = TOAST_COLORS[type];
  const icon = TOAST_ICONS[type];

  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    display: flex; align-items: center; gap: 10px;
    padding: 14px 20px; border-radius: 14px;
    background: ${colors.bg}; border: 1px solid ${colors.border};
    color: ${colors.text}; font-size: 13px; font-weight: 600;
    font-family: 'Inter', system-ui, sans-serif;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    transform: translateY(20px); opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    max-width: 420px;
  `;
  toast.innerHTML = `<span style="font-size:16px">${icon}</span><span>${message}</span>`;

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  });

  // Animate out and remove
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 350);
  }, duration);
}
