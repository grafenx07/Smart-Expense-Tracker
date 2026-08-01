/**
 * Returns a YYYY-MM label for a given ISO date string.
 * Used as the key when bucketing expenses by month for trend data.
 */
export function toMonthKey(isoDate: string): string {
  return isoDate.substring(0, 7); // "2026-07"
}

/**
 * Converts a YYYY-MM key to a human-readable label (e.g. "Jul 2026").
 */
export function monthKeyToLabel(key: string): string {
  const [year, month] = key.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

/**
 * Returns today's date in YYYY-MM-DD format.
 */
export function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns the current year-month key, e.g. "2026-07".
 */
export function currentMonthKey(): string {
  return toMonthKey(todayIso());
}
