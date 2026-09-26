/**
 * "October 1, 2026". Offerings have no timezone of their own, so sales dates
 * show in UTC; session times use each session's timezone (DEV-93).
 */
export function formatDate(value: string | Date, timeZone = 'UTC'): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone }).format(new Date(value))
}
