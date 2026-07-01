// Number formatting utilities

export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

export function formatCompact(num: number): string {
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
}

export function formatStipendRange(min?: number, max?: number): string {
  if (!min && !max) return 'Unpaid';
  if (min && max) return `Rs.${formatCompact(min)} - Rs.${formatCompact(max)}/mo`;
  return `Up to Rs.${formatCompact(max!)}/mo`;
}
