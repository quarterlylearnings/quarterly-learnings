import { afterEach, describe, expect, it, vi } from 'vitest'
import { accessEndsAt, addMonthsUTC, classLinkWindow, enrollmentExpiresAt, isTimeZone } from './sessions.ts'

describe('addMonthsUTC', () => {
  it('adds calendar months in UTC, keeping the time of day', () => {
    expect(addMonthsUTC('2026-11-20T23:30:00.000Z', 6).toISOString()).toBe('2027-05-20T23:30:00.000Z')
  })

  it('clamps to the end of a shorter month', () => {
    expect(addMonthsUTC('2026-08-31T12:00:00.000Z', 6).toISOString()).toBe('2027-02-28T12:00:00.000Z')
    expect(addMonthsUTC('2027-08-31T12:00:00.000Z', 6).toISOString()).toBe('2028-02-29T12:00:00.000Z')
  })
})

describe('accessEndsAt', () => {
  it('is the latest session end plus 6 months', () => {
    expect(
      accessEndsAt([
        { endsAt: '2026-11-03T18:00:00.000Z' },
        { endsAt: '2026-11-17T18:00:00.000Z' },
        { endsAt: '2026-11-10T18:00:00.000Z' },
      ]),
    ).toBe('2027-05-17T18:00:00.000Z')
  })

  it('is null without sessions', () => {
    expect(accessEndsAt([])).toBeNull()
    expect(accessEndsAt(undefined)).toBeNull()
  })
})

describe('enrollmentExpiresAt', () => {
  it('uses the offering date when there is one, else purchase + 6 months', () => {
    expect(enrollmentExpiresAt('2027-05-17T18:00:00.000Z', '2026-10-01T00:00:00.000Z')).toBe('2027-05-17T18:00:00.000Z')
    expect(enrollmentExpiresAt(null, '2026-10-01T00:00:00.000Z')).toBe('2027-04-01T00:00:00.000Z')
  })
})

describe('classLinkWindow (fake timers)', () => {
  const session = { startsAt: '2026-11-03T17:00:00.000Z', endsAt: '2026-11-03T18:30:00.000Z' }
  const at = (iso: string) => {
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(iso))
    return classLinkWindow(session)
  }

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is upcoming at 24 hours and 1 second before the start', () => {
    expect(at('2026-11-02T16:59:59.000Z')).toBe('upcoming')
  })

  it('opens exactly 24 hours before the start', () => {
    expect(at('2026-11-02T17:00:00.000Z')).toBe('open')
  })

  it('is still open at the exact end', () => {
    expect(at('2026-11-03T18:30:00.000Z')).toBe('open')
  })

  it('has ended 1 second after the end', () => {
    expect(at('2026-11-03T18:30:01.000Z')).toBe('ended')
  })
})

describe('isTimeZone', () => {
  it('accepts IANA names and UTC, and rejects anything else', () => {
    expect(isTimeZone('America/New_York')).toBe(true)
    expect(isTimeZone('UTC')).toBe(true)
    expect(isTimeZone('Eastern')).toBe(false)
    expect(isTimeZone('')).toBe(false)
  })
})
