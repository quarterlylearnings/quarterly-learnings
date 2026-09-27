/**
 * "October 1, 2026". Offerings have no timezone of their own, so sales dates
 * show in UTC; session times use each session's timezone (DEV-93).
 */
export function formatDate(value: string | Date, timeZone = 'UTC'): string {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone }).format(new Date(value))
}

/**
 * A session's time in its own time zone:
 * "Tue, Nov 3, 2026, 12:00 – 1:30 PM EST".
 */
export function formatSessionTime(startsAt: string, endsAt: string, timeZone: string): string {
  const format = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone,
    timeZoneName: 'short',
  })
  return format.formatRange(new Date(startsAt), new Date(endsAt))
}
