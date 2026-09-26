import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Course, Lesson, Offering, User } from '../../payload-types.ts'
import { createCourse, createLesson, createOffering, createUser, daysFromNow, enroll } from '../../test/factories.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'

describe('Enrollments', () => {
  let payload: Payload
  let admin: User
  let learner: User
  let otherLearner: User
  let course: Course
  let offering: Offering

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    admin = await createUser(payload, 'admin')
    learner = await createUser(payload)
    otherLearner = await createUser(payload)
    course = await createCourse(payload)
    offering = await createOffering(payload, course)
  })

  it('lets an admin create a manual enrollment, filling course from the offering', async () => {
    const other = await createCourse(payload)
    const enrollment = await payload.create({
      collection: 'enrollments',
      data: {
        learner: learner.id,
        offering: offering.id,
        // A mismatched course is corrected: it always follows the offering.
        course: other.id,
        source: 'manual',
        status: 'active',
        accessExpiresAt: daysFromNow(30),
      },
      user: admin,
      overrideAccess: false,
      depth: 0,
    })
    expect(enrollment.course).toBe(course.id)
    expect(enrollment.source).toBe('manual')
  })

  it('allows only one enrollment per learner and offering', async () => {
    await enroll(payload, learner, offering)
    await expect(enroll(payload, learner, offering)).rejects.toThrow()
    // A second offering of the same course is fine.
    await enroll(payload, learner, await createOffering(payload, course))
  })

  describe('access', () => {
    beforeEach(async () => {
      await enroll(payload, learner, offering)
      await enroll(payload, otherLearner, offering)
    })

    it('lets learners read only their own enrollments', async () => {
      const { docs } = await payload.find({ collection: 'enrollments', user: learner, overrideAccess: false, depth: 0 })
      expect(docs.map((doc) => doc.learner)).toEqual([learner.id])
    })

    it('refuses anonymous visitors', async () => {
      // Read access is `false` without a user, which Payload answers with Forbidden.
      await expect(payload.find({ collection: 'enrollments', overrideAccess: false })).rejects.toThrow(/not allowed/i)
    })

    it('lets admins read every enrollment', async () => {
      const { totalDocs } = await payload.find({ collection: 'enrollments', user: admin, overrideAccess: false })
      expect(totalDocs).toBe(2)
    })

    it('does not let learners create or edit enrollments', async () => {
      await expect(
        enrollAs(learner, await createOffering(payload, course)),
      ).rejects.toThrow()

      const { docs } = await payload.find({ collection: 'enrollments', where: { learner: { equals: learner.id } } })
      await expect(
        payload.update({
          collection: 'enrollments',
          id: docs[0].id,
          data: { accessExpiresAt: daysFromNow(3650) },
          user: learner,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })
  })

  const enrollAs = (user: User, target: Offering) =>
    payload.create({
      collection: 'enrollments',
      data: {
        learner: user.id,
        offering: target.id,
        course: course.id,
        source: 'manual',
        status: 'active',
        accessExpiresAt: daysFromNow(30),
      },
      user,
      overrideAccess: false,
    })

  describe('lesson content', () => {
    let locked: Lesson

    beforeEach(async () => {
      locked = await createLesson(payload, course, { title: 'Locked', preview: false })
    })

    const contentFor = async (user: User) =>
      (await payload.findByID({ collection: 'lessons', id: locked.id, user, overrideAccess: false })).content

    it('is readable by a learner with an active enrollment', async () => {
      await enroll(payload, learner, offering)
      expect(await contentFor(learner)).toBeTruthy()
    })

    it.each([
      ['refunded', { status: 'refunded' as const }],
      ['revoked', { status: 'revoked' as const }],
      ['expired', { accessExpiresAt: daysFromNow(-1) }],
    ])('is hidden when the enrollment is %s', async (_label, data) => {
      await enroll(payload, learner, offering, data)
      expect(await contentFor(learner)).toBeUndefined()
    })

    it('is hidden from a learner enrolled in a different course', async () => {
      const other = await createCourse(payload)
      await enroll(payload, learner, await createOffering(payload, other))
      expect(await contentFor(learner)).toBeUndefined()
    })
  })
})
