// lib/confirmDialog.ts: Styled confirmation dialog for destructive actions

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

/**
 * Shows a styled confirmation modal and returns a promise that resolves
 * to true (confirmed) or false (cancelled).
 */
export function showConfirmDialog({
  title = 'Are you sure?',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.2s ease;
    `;

    const accentColor = variant === 'danger' ? '#ef4444' : '#f59e0b';

    const dialog = document.createElement('div');
    dialog.style.cssText = `
      background: white; border-radius: 20px; padding: 28px;
      max-width: 380px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.15);
      font-family: 'Inter', system-ui, sans-serif;
      transform: scale(0.95); transition: transform 0.2s ease;
    `;
    dialog.innerHTML = `
      <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 700; color: #1e293b;">${title}</h3>
      <p style="margin: 0 0 24px 0; font-size: 13px; color: #64748b; line-height: 1.5;">${message}</p>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button id="__confirm_cancel" style="
          padding: 10px 18px; border-radius: 12px; border: 1px solid #e2e8f0;
          background: white; color: #475569; font-size: 13px; font-weight: 600;
          cursor: pointer;
        ">${cancelText}</button>
        <button id="__confirm_ok" style="
          padding: 10px 18px; border-radius: 12px; border: none;
          background: ${accentColor}; color: white; font-size: 13px; font-weight: 600;
          cursor: pointer;
        ">${confirmText}</button>
      </div>
    `;

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      dialog.style.transform = 'scale(1)';
    });

    const cleanup = (result: boolean) => {
      overlay.style.opacity = '0';
      dialog.style.transform = 'scale(0.95)';
      setTimeout(() => overlay.remove(), 200);
      resolve(result);
    };

    dialog.querySelector('#__confirm_cancel')!.addEventListener('click', () => cleanup(false));
    dialog.querySelector('#__confirm_ok')!.addEventListener('click', () => cleanup(true));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(false); });
  });
}
