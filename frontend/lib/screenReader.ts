// Screen reader utilities

/**
 * Announce a message to screen readers via a live region.
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', priority);
  el.setAttribute('aria-atomic', 'true');
  el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}
