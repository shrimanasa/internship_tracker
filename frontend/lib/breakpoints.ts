// Responsive breakpoint constants

export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
} as const;

export function isBreakpoint(size: keyof typeof BREAKPOINTS): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= BREAKPOINTS[size];
}
