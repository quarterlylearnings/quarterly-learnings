import type { Payload } from 'payload'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Course, Offering, User } from '../../payload-types.ts'
import { hasOfferingAccess } from '../access/hasOfferingAccess.ts'
import { createCourse, createOffering, createUser, daysFromNow, enroll } from '../../test/factories.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'

const START = '2026-11-03T17:00:00.000Z'
const END = '2026-11-03T18:30:00.000Z'
const LINK = 'https://zoom.us/j/111'
const session = (data: Partial<NonNullable<Offering['sessions']>[number]> = {}) => ({
  title: 'Week 1',
  startsAt: START,
  endsAt: END,
  timezone: 'America/New_York',
  classLink: LINK,
  ...data,
})

describe('Offering sessions', () => {
  let payload: Payload
  let admin: User
  let learner: User
  let otherLearner: User
  let course: Course

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    admin = await createUser(payload, 'admin')
    learner = await createUser(payload)
    otherLearner = await createUser(payload)
    course = await createCourse(payload)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const enrollmentOf = async (user: User, offering: Offering) => {
    const { docs } = await payload.find({
      collection: 'enrollments',
      where: { and: [{ learner: { equals: user.id } }, { offering: { equals: offering.id } }] },
    })
    return docs[0]
  }

  describe('accessEndsAt', () => {
    it('is the latest session end + 6 months, and null without sessions', async () => {
      const none = await createOffering(payload, course)
      expect(none.accessEndsAt ?? null).toBeNull()

      const withSessions = await createOffering(payload, course, {
        sessions: [session(), session({ title: 'Week 2', startsAt: '2026-11-10T17:00:00Z', endsAt: '2026-11-10T18:30:00Z' })],
      })
      expect(withSessions.accessEndsAt).toBe('2027-05-10T18:30:00.000Z')
    })

    it('ignores an admin-supplied value', async () => {
      const offering = await createOffering(payload, course, { sessions: [session()], accessEndsAt: '2099-01-01T00:00:00Z' })
      expect(offering.accessEndsAt).toBe('2027-05-03T18:30:00.000Z')
    })
  })

  describe('enrollment access dates', () => {
    it('come from the offering on create', async () => {
      const offering = await createOffering(payload, course, { sessions: [session()] })
      const enrollment = await payload.create({
        collection: 'enrollments',
        data: { learner: learner.id, offering: offering.id, course: course.id, source: 'manual', status: 'active' } as never,
      })
      expect(enrollment.accessExpiresAt).toBe('2027-05-03T18:30:00.000Z')
    })

    it('fall back to creation + 6 months when the offering has no sessions', async () => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date('2026-10-01T09:00:00.000Z'))
      const offering = await createOffering(payload, course)
      const enrollment = await payload.create({
        collection: 'enrollments',
        data: { learner: learner.id, offering: offering.id, course: course.id, source: 'manual', status: 'active' } as never,
      })
      expect(enrollment.accessExpiresAt).toBe('2027-04-01T09:00:00.000Z')
    })

    it('are recomputed for every enrollment when sessions change', async () => {
      const offering = await createOffering(payload, course, { sessions: [session()] })
      await enroll(payload, learner, offering, { accessExpiresAt: '2027-05-03T18:30:00.000Z' })
      await enroll(payload, otherLearner, offering, { accessExpiresAt: '2027-05-03T18:30:00.000Z' })

      await payload.update({
        collection: 'offerings',
        id: offering.id,
        data: {
          sessions: [...(offering.sessions ?? []), session({ title: 'Week 5', startsAt: '2026-12-01T17:00:00Z', endsAt: '2026-12-01T18:30:00Z' })],
        },
      })
      expect((await enrollmentOf(learner, offering)).accessExpiresAt).toBe('2027-06-01T18:30:00.000Z')
      expect((await enrollmentOf(otherLearner, offering)).accessExpiresAt).toBe('2027-06-01T18:30:00.000Z')
    })

    it('fall back to each enrollment’s creation + 6 months when all sessions are removed', async () => {
      const offering = await createOffering(payload, course, { sessions: [session()] })
      const enrollment = await enroll(payload, learner, offering)
      await payload.update({ collection: 'offerings', id: offering.id, data: { sessions: [] } })
      const expected = new Date(enrollment.createdAt)
      expected.setUTCMonth(expected.getUTCMonth() + 6)
      expect(new Date((await enrollmentOf(learner, offering)).accessExpiresAt).getTime()).toBeGreaterThan(Date.now())
      expect((await enrollmentOf(learner, offering)).accessExpiresAt.slice(0, 10)).toBe(expected.toISOString().slice(0, 10))
    })

    it('leave other offerings alone', async () => {
      const edited = await createOffering(payload, course, { sessions: [session()] })
      const untouched = await createOffering(payload, course, { sessions: [session()] })
      await enroll(payload, learner, untouched, { accessExpiresAt: '2027-05-03T18:30:00.000Z' })
      await payload.update({ collection: 'offerings', id: edited.id, data: { sessions: [] } })
      expect((await enrollmentOf(learner, untouched)).accessExpiresAt).toBe('2027-05-03T18:30:00.000Z')
    })
  })

  describe('hasOfferingAccess', () => {
    it('is true only for an active, unexpired enrollment in that offering', async () => {
      const offering = await createOffering(payload, course)
      const other = await createOffering(payload, course)
      expect(await hasOfferingAccess(payload, learner, offering.id)).toBe(false)

      await enroll(payload, learner, offering)
      expect(await hasOfferingAccess(payload, learner, offering.id)).toBe(true)
      expect(await hasOfferingAccess(payload, learner, other.id)).toBe(false)
      expect(await hasOfferingAccess(payload, null, offering.id)).toBe(false)

      await enroll(payload, otherLearner, offering, { accessExpiresAt: daysFromNow(-1) })
      expect(await hasOfferingAccess(payload, otherLearner, offering.id)).toBe(false)
    })

    it('is false for refunded and revoked enrollments', async () => {
      const offering = await createOffering(payload, course)
      await enroll(payload, learner, offering, { status: 'refunded' })
      await enroll(payload, otherLearner, offering, { status: 'revoked' })
      expect(await hasOfferingAccess(payload, learner, offering.id)).toBe(false)
      expect(await hasOfferingAccess(payload, otherLearner, offering.id)).toBe(false)
    })
  })

  describe('class link access (fake timers)', () => {
    let offering: Offering

    beforeEach(async () => {
      offering = await createOffering(payload, course, { salesState: 'closed', sessions: [session()] })
      await enroll(payload, learner, offering, { accessExpiresAt: '2099-01-01T00:00:00Z' })
      // Enrolled in a different offering of the same course.
      const sibling = await createOffering(payload, course, { sessions: [session({ classLink: 'https://zoom.us/j/222' })] })
      await enroll(payload, otherLearner, sibling, { accessExpiresAt: '2099-01-01T00:00:00Z' })
    })

    const linkAt = async (iso: string, user?: User) => {
      vi.useFakeTimers({ toFake: ['Date'] })
      vi.setSystemTime(new Date(iso))
      try {
        const doc = await payload.findByID({ collection: 'offerings', id: offering.id, user, overrideAccess: false })
        return doc.sessions?.[0]?.classLink
      } finally {
        vi.useRealTimers()
      }
    }

    it('lets an enrolled learner read their own offering even when Closed, with the link only in the window', async () => {
      expect(await linkAt('2026-11-02T16:59:59.000Z', learner)).toBeUndefined()
      expect(await linkAt('2026-11-02T17:00:00.000Z', learner)).toBe(LINK)
      expect(await linkAt('2026-11-03T18:30:00.000Z', learner)).toBe(LINK)
      expect(await linkAt('2026-11-03T18:30:01.000Z', learner)).toBeUndefined()
    })

    it('never gives the link to a learner enrolled in a different offering', async () => {
      // They can't read this Closed offering at all.
      await expect(linkAt('2026-11-03T17:30:00.000Z', otherLearner)).rejects.toThrow()
    })

    it('never gives the link to anonymous visitors of an On sale offering', async () => {
      await payload.update({ collection: 'offerings', id: offering.id, data: { salesState: 'on_sale' } })
      const doc = await (async () => {
        vi.useFakeTimers({ toFake: ['Date'] })
        vi.setSystemTime(new Date('2026-11-03T17:30:00.000Z'))
        try {
          return await payload.findByID({ collection: 'offerings', id: offering.id, overrideAccess: false })
        } finally {
          vi.useRealTimers()
        }
      })()
      expect(doc.sessions?.[0]?.title).toBe('Week 1')
      expect(doc.sessions?.[0]?.classLink).toBeUndefined()
    })

    it('always gives admins the link', async () => {
      expect(await linkAt('2020-01-01T00:00:00.000Z', admin)).toBe(LINK)
    })
  })

  describe('validation', () => {
    it('rejects a session that ends before it starts, an unknown time zone and a non-web link', async () => {
      await expect(createOffering(payload, course, { sessions: [session({ endsAt: START })] })).rejects.toThrow()
      await expect(createOffering(payload, course, { sessions: [session({ timezone: 'Eastern' })] })).rejects.toThrow()
      await expect(createOffering(payload, course, { sessions: [session({ classLink: 'zoom.us/j/1' })] })).rejects.toThrow()
    })
  })
})
