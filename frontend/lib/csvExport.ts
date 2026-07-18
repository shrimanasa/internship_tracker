// lib/csvExport.ts: Client-side CSV export utility

/**
 * Converts an array of objects to a CSV string and triggers a browser download.
 *
 * @param data - Array of flat objects to export
 * @param filename - Download filename (without extension)
 * @param columns - Optional column config: { key, label } to control order and headers
 */
export function downloadCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export',
  columns?: Array<{ key: keyof T; label: string }>
): void {
  if (!data.length) return;

  // Determine column order and headers
  const cols = columns || Object.keys(data[0]).map((key) => ({ key, label: key }));

  // Build CSV header row
  const header = cols.map((c) => `"${String(c.label)}"`).join(',');

  // Build CSV data rows
  const rows = data.map((row) =>
    cols
      .map((c) => {
        const val = row[c.key as string];
        if (val === null || val === undefined) return '""';
        // Escape double quotes by doubling them
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',')
  );

  const csvContent = [header, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
