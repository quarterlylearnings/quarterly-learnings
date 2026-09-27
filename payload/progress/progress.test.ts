import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Course, Lesson, Offering, User } from '../../payload-types.ts'
import { createCourse, createLesson, createOffering, createUser, daysFromNow, enroll } from '../../test/factories.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'
import { courseProgress, isLessonComplete, markLessonComplete } from './progress.ts'

describe('Lesson progress', () => {
  let payload: Payload
  let learner: User
  let course: Course
  let offering: Offering
  let first: Lesson
  let second: Lesson
  let third: Lesson

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    await createUser(payload, 'admin')
    learner = await createUser(payload)
    course = await createCourse(payload, 'Progress Course')
    offering = await createOffering(payload, course)
    first = await createLesson(payload, course, { title: 'First', order: 1, preview: true })
    second = await createLesson(payload, course, { title: 'Second', order: 2 })
    third = await createLesson(payload, course, { title: 'Third', order: 3 })
  })

  const progressOf = async () => {
    const { docs } = await payload.find({ collection: 'enrollments', where: { learner: { equals: learner.id } } })
    return docs.map((doc) => (doc.progress ?? []).length)
  }

  describe('markLessonComplete', () => {
    it('refuses without an enrollment, including on a preview lesson', async () => {
      expect(await markLessonComplete(payload, learner, first.id)).toMatchObject({ ok: false })
      expect(await markLessonComplete(payload, null, first.id)).toMatchObject({ ok: false })
    })

    it('refuses when the enrollment has expired, been refunded or revoked', async () => {
      await enroll(payload, learner, offering, { accessExpiresAt: daysFromNow(-1) })
      expect(await markLessonComplete(payload, learner, second.id)).toMatchObject({ ok: false })

      const other = await createOffering(payload, course)
      await enroll(payload, learner, other, { status: 'refunded' })
      expect(await markLessonComplete(payload, learner, second.id)).toMatchObject({ ok: false })
      expect(await progressOf()).toEqual([0, 0])
    })

    it('records the lesson once, however often it is marked', async () => {
      await enroll(payload, learner, offering)
      expect(await markLessonComplete(payload, learner, second.id)).toEqual({ ok: true, alreadyComplete: false })
      expect(await markLessonComplete(payload, learner, second.id)).toEqual({ ok: true, alreadyComplete: true })
      expect(await progressOf()).toEqual([1])
      expect(await isLessonComplete(payload, learner, course.id, second.id)).toBe(true)
      expect(await isLessonComplete(payload, learner, course.id, third.id)).toBe(false)
    })

    it('rejects unknown and draft lessons', async () => {
      await enroll(payload, learner, offering)
      const draft = await payload.create({
        collection: 'lessons',
        data: { course: course.id, order: 9, slug: '', title: 'Draft', _status: 'draft' },
        draft: true,
      })
      expect(await markLessonComplete(payload, learner, draft.id)).toMatchObject({ ok: false })
      expect(await markLessonComplete(payload, learner, 'not-an-id')).toMatchObject({ ok: false })
    })
  })

  describe('courseProgress', () => {
    it('shows completed / total and the next incomplete lesson in outline order', async () => {
      await enroll(payload, learner, offering)
      await markLessonComplete(payload, learner, first.id)
      await markLessonComplete(payload, learner, third.id)
      expect(await courseProgress(payload, learner)).toEqual([
        {
          course: { id: course.id, title: 'Progress Course', slug: course.slug },
          completed: 2,
          total: 3,
          nextLesson: { title: 'Second', slug: second.slug },
        },
      ])
    })

    it('has no next lesson once everything is complete', async () => {
      await enroll(payload, learner, offering)
      for (const lesson of [first, second, third]) await markLessonComplete(payload, learner, lesson.id)
      expect((await courseProgress(payload, learner))[0]).toMatchObject({ completed: 3, total: 3, nextLesson: null })
    })

    it('uses the active enrollment with the latest accessExpiresAt', async () => {
      const older = await enroll(payload, learner, offering, { accessExpiresAt: daysFromNow(10) })
      await payload.update({
        collection: 'enrollments',
        id: older.id,
        data: { progress: [{ lesson: first.id, completedAt: new Date().toISOString() }] },
      })
      const later = await createOffering(payload, course)
      await enroll(payload, learner, later, { accessExpiresAt: daysFromNow(200) })

      const rows = await courseProgress(payload, learner)
      expect(rows).toHaveLength(1)
      expect(rows[0].completed).toBe(0)

      // New completions go to that same enrollment.
      await markLessonComplete(payload, learner, second.id)
      expect((await courseProgress(payload, learner))[0].completed).toBe(1)
    })

    it('leaves out expired courses and anonymous visitors', async () => {
      await enroll(payload, learner, offering, { accessExpiresAt: daysFromNow(-1) })
      expect(await courseProgress(payload, learner)).toEqual([])
      expect(await courseProgress(payload, null)).toEqual([])
    })
  })

  it('does not let learners write progress through the API', async () => {
    const enrollment = await enroll(payload, learner, offering)
    await expect(
      payload.update({
        collection: 'enrollments',
        id: enrollment.id,
        data: { progress: [{ lesson: first.id, completedAt: new Date().toISOString() }] },
        user: learner,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
    expect(await progressOf()).toEqual([0])
  })
})
