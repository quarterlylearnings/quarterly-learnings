const HOUR = 60 * 60 * 1000

/** The class link shows from this long before a session starts (PRD §3.4 R10). */
export const CLASS_LINK_LEAD_MS = 24 * HOUR

/** Access lasts this many calendar months after the last session ends (PRD §3.5 R13). */
export const ACCESS_MONTHS = 6

type SessionTimes = { startsAt: string | Date; endsAt: string | Date }

/**
 * Adds calendar months in UTC, clamping to the end of shorter months:
 * Aug 31 + 6 months = Feb 28 (or 29). Done by hand rather than with date-fns,
 * whose addMonths works in the server's local time zone.
 */
export function addMonthsUTC(value: string | Date, months: number): Date {
  const date = new Date(value)
  const target = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth() + months,
      1,
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds(),
    ),
  )
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate()
  target.setUTCDate(Math.min(date.getUTCDate(), lastDay))
  return target
}

/** `accessEndsAt` for an offering: latest session end + 6 months, or null without sessions (PRD §5.2). */
export function accessEndsAt(sessions: Array<{ endsAt?: string | Date | null }> | null | undefined): string | null {
  const ends = (sessions ?? []).map((session) => session.endsAt).filter(Boolean) as Array<string | Date>
  if (ends.length === 0) return null
  const latest = Math.max(...ends.map((end) => new Date(end).getTime()))
  return addMonthsUTC(new Date(latest), ACCESS_MONTHS).toISOString()
}

/** `accessExpiresAt` for an enrollment: the offering's `accessEndsAt`, else purchase date + 6 months. */
export function enrollmentExpiresAt(offeringAccessEndsAt: string | null | undefined, purchasedAt: string | Date): string {
  return offeringAccessEndsAt ?? addMonthsUTC(purchasedAt, ACCESS_MONTHS).toISOString()
}

export type ClassLinkWindow = 'upcoming' | 'open' | 'ended'

/**
 * Where `now` falls for a session's class link: open from 24 hours before the
 * start until the end, both inclusive; ended after that.
 */
export function classLinkWindow({ startsAt, endsAt }: SessionTimes, now = new Date()): ClassLinkWindow {
  const time = now.getTime()
  if (time > new Date(endsAt).getTime()) return 'ended'
  if (time >= new Date(startsAt).getTime() - CLASS_LINK_LEAD_MS) return 'open'
  return 'upcoming'
}

const TIME_ZONES = new Set([...Intl.supportedValuesOf('timeZone'), 'UTC'])

/** IANA time zone names such as America/New_York, plus UTC. */
export function isTimeZone(value: unknown): value is string {
  return typeof value === 'string' && TIME_ZONES.has(value)
}
