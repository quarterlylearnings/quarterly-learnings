import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Course, Lesson, User } from '../../payload-types.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'
import { richText } from '../utilities/richText.ts'

const courseBase = { description: 'A course.', level: 'beginner' as const, _status: 'published' as const }
const content = richText(['Lesson body.'])

/** Payload's ValidationError keeps the per-field message in `data.errors`. */
const slugClash = expect.objectContaining({
  data: expect.objectContaining({
    errors: [expect.objectContaining({ path: 'slug', message: expect.stringMatching(/already uses the slug/) })],
  }),
})

describe('Lessons', () => {
  let payload: Payload
  let admin: User
  let learner: User
  let course: Course
  let otherCourse: Course

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    admin = await payload.create({
      collection: 'users',
      data: { email: 'admin@example.com', password: 'pw-123456', role: 'admin' },
    })
    learner = await payload.create({
      collection: 'users',
      data: { email: 'learner@example.com', password: 'pw-123456', role: 'learner' },
    })
    course = await payload.create({ collection: 'courses', data: { ...courseBase, title: 'Course A', slug: '' } })
    otherCourse = await payload.create({ collection: 'courses', data: { ...courseBase, title: 'Course B', slug: '' } })
  })

  const createLesson = (data: Partial<Lesson> & { title: string }) =>
    payload.create({
      collection: 'lessons',
      data: { course: course.id, order: 1, slug: '', content, _status: 'published', ...data },
    })

  const readAs = (id: string, user?: User) =>
    payload.findByID({ collection: 'lessons', id, user, overrideAccess: false })

  describe('content field access', () => {
    it('lets anyone read the content of a preview lesson', async () => {
      const lesson = await createLesson({ title: 'Preview', preview: true })
      expect((await readAs(lesson.id)).content).toBeTruthy()
      expect((await readAs(lesson.id, learner)).content).toBeTruthy()
    })

    it('hides the content of a non-preview lesson from anonymous visitors and learners', async () => {
      const lesson = await createLesson({ title: 'Locked', preview: false })
      const anonymous = await readAs(lesson.id)
      expect(anonymous.title).toBe('Locked')
      expect(anonymous.content).toBeUndefined()
      expect((await readAs(lesson.id, learner)).content).toBeUndefined()
    })

    it('lets admins read the content of a non-preview lesson', async () => {
      const lesson = await createLesson({ title: 'Locked', preview: false })
      expect((await readAs(lesson.id, admin)).content).toBeTruthy()
    })

    it('hides draft lessons from everyone but admins', async () => {
      const draft = await payload.create({
        collection: 'lessons',
        data: { course: course.id, order: 1, slug: '', title: 'Draft', preview: true, _status: 'draft' },
        draft: true,
      })
      await expect(readAs(draft.id)).rejects.toThrow()
      await expect(readAs(draft.id, learner)).rejects.toThrow()
      expect((await readAs(draft.id, admin)).title).toBe('Draft')
    })
  })

  describe('slug', () => {
    it('is generated from the title', async () => {
      expect((await createLesson({ title: 'What Counts as AI?' })).slug).toBe('what-counts-as-ai')
    })

    it('rejects a duplicate slug within the same course', async () => {
      await createLesson({ title: 'Introduction' })
      await expect(createLesson({ title: 'Introduction' })).rejects.toEqual(slugClash)
    })

    it('allows the same slug in a different course', async () => {
      await createLesson({ title: 'Introduction' })
      const other = await createLesson({ title: 'Introduction', course: otherCourse.id })
      expect(other.slug).toBe('introduction')
    })

    it('lets a lesson be saved again without clashing with itself', async () => {
      const lesson = await createLesson({ title: 'Introduction' })
      const updated = await payload.update({ collection: 'lessons', id: lesson.id, data: { order: 2 } })
      expect(updated.order).toBe(2)
    })

    it('rejects moving a lesson into a course that already has its slug', async () => {
      await createLesson({ title: 'Introduction' })
      const moving = await createLesson({ title: 'Introduction', course: otherCourse.id })
      await expect(
        payload.update({ collection: 'lessons', id: moving.id, data: { course: course.id } }),
      ).rejects.toEqual(slugClash)
    })
  })

  it('does not let learners create lessons', async () => {
    await expect(
      payload.create({
        collection: 'lessons',
        data: { course: course.id, order: 1, slug: '', title: 'Sneaky', _status: 'published' },
        user: learner,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})
