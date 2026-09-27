import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Course, Lesson, Offering, User } from '../../payload-types.ts'
import { createCourse, createLesson, createOffering, createUser, enroll } from '../../test/factories.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'
import { quizBlocks } from '../quiz/answers.ts'
import { gradeQuizAttempt } from '../quiz/grade.ts'
import { placeholderImage } from '../utilities/placeholderImage.ts'
import { block, richText } from '../utilities/richText.ts'

const QUIZ_ID = '66f5a0000000000000000b01'
const quizContent = richText(
  ['Body.'],
  [block('quizBlock', { question: 'Q?', options: [{ text: 'A' }, { text: 'B' }], correctIndex: 1 }, QUIZ_ID)],
)

describe('Instructor access (DEV-96)', () => {
  let payload: Payload
  let admin: User
  let instructor: User
  let otherInstructor: User
  let learner: User
  let assigned: Course
  let unassigned: Course
  let assignedDraft: Course
  let lesson: Lesson
  let draftLesson: Lesson
  let otherLesson: Lesson
  let offering: Offering
  let otherOffering: Offering

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    admin = await createUser(payload, 'admin')
    instructor = await createUser(payload, 'instructor')
    otherInstructor = await createUser(payload, 'instructor')
    learner = await createUser(payload)

    assigned = await createCourse(payload, 'Assigned')
    await payload.update({ collection: 'courses', id: assigned.id, data: { instructors: [instructor.id] } })
    unassigned = await createCourse(payload, 'Unassigned')
    await payload.update({ collection: 'courses', id: unassigned.id, data: { instructors: [otherInstructor.id] } })
    assignedDraft = await payload.create({
      collection: 'courses',
      data: { title: 'Assigned Draft', slug: '', description: 'd', level: 'beginner', instructors: [instructor.id], _status: 'draft' },
      draft: true,
    })

    lesson = await createLesson(payload, assigned, { title: 'Assigned Lesson', preview: false, content: quizContent })
    draftLesson = await payload.create({
      collection: 'lessons',
      data: { course: assigned.id, order: 2, slug: '', title: 'Assigned Draft Lesson', _status: 'draft' },
      draft: true,
    })
    otherLesson = await createLesson(payload, unassigned, { title: 'Other Lesson', preview: false, content: quizContent })

    offering = await createOffering(payload, assigned, {
      salesState: 'closed',
      sessions: [
        { title: 'S1', startsAt: '2030-01-01T17:00:00Z', endsAt: '2030-01-01T18:00:00Z', timezone: 'UTC', classLink: 'https://meet.example.com/a' },
      ],
    })
    otherOffering = await createOffering(payload, unassigned, { salesState: 'closed' })
  })

  const as = (user?: User) => ({ user, overrideAccess: false as const })

  describe('users', () => {
    it('only admins set roles; instructors read only themselves', async () => {
      await expect(
        payload.update({ collection: 'users', id: learner.id, data: { role: 'instructor' }, ...as(instructor) }),
      ).rejects.toThrow()
      const promoted = await payload.update({ collection: 'users', id: learner.id, data: { role: 'instructor' }, ...as(admin) })
      expect(promoted.role).toBe('instructor')

      const { docs } = await payload.find({ collection: 'users', ...as(instructor) })
      expect(docs.map((doc) => doc.id)).toEqual([instructor.id])
    })

    it('an instructor cannot promote themselves to admin', async () => {
      const self = await payload.update({ collection: 'users', id: instructor.id, data: { role: 'admin' }, ...as(instructor) })
      expect(self.role).toBe('instructor')
    })
  })

  describe('courses', () => {
    it('instructors read published courses plus drafts of their own', async () => {
      const { docs } = await payload.find({ collection: 'courses', draft: true, sort: 'title', ...as(instructor) })
      expect(docs.map((doc) => doc.title)).toEqual(['Assigned', 'Assigned Draft', 'Unassigned'])
      const { docs: learnerDocs } = await payload.find({ collection: 'courses', sort: 'title', ...as(learner) })
      expect(learnerDocs.map((doc) => doc.title)).toEqual(['Assigned', 'Unassigned'])
    })

    it('instructors edit and publish only assigned courses', async () => {
      const edited = await payload.update({ collection: 'courses', id: assignedDraft.id, data: { _status: 'published' }, ...as(instructor) })
      expect(edited._status).toBe('published')
      await expect(
        payload.update({ collection: 'courses', id: unassigned.id, data: { title: 'Hijacked' }, ...as(instructor) }),
      ).rejects.toThrow()
      await expect(payload.delete({ collection: 'courses', id: assigned.id, ...as(instructor) })).rejects.toThrow()
    })

    it('only admins set instructors; an instructor creating a course is assigned to it', async () => {
      const updated = await payload.update({
        collection: 'courses',
        id: assigned.id,
        data: { instructors: [instructor.id, otherInstructor.id] },
        depth: 0,
        ...as(instructor),
      })
      expect(updated.instructors).toEqual([instructor.id])

      const created = await payload.create({
        collection: 'courses',
        data: { title: 'Mine', slug: '', description: 'd', level: 'beginner', instructors: [otherInstructor.id], _status: 'draft' },
        draft: true,
        depth: 0,
        ...as(instructor),
      })
      expect(created.instructors).toEqual([instructor.id])
      // And they can keep editing it.
      await payload.update({ collection: 'courses', id: created.id, data: { title: 'Mine, renamed' }, draft: true, ...as(instructor) })
    })

    it('learners cannot create courses', async () => {
      await expect(
        payload.create({
          collection: 'courses',
          data: { title: 'Nope', slug: '', description: 'd', level: 'beginner', _status: 'draft' },
          draft: true,
          ...as(learner),
        }),
      ).rejects.toThrow()
    })

    it('an admin saving only a draft of a published course does not change who is assigned yet', async () => {
      await payload.update({
        collection: 'courses',
        id: unassigned.id,
        data: { instructors: [instructor.id] },
        draft: true,
      })
      await expect(
        payload.update({ collection: 'courses', id: unassigned.id, data: { title: 'Now mine?' }, ...as(instructor) }),
      ).rejects.toThrow()
      await payload.update({ collection: 'courses', id: unassigned.id, data: { instructors: [instructor.id], _status: 'published' } })
      const nowMine = await payload.update({ collection: 'courses', id: unassigned.id, data: { title: 'Now mine' }, ...as(instructor) })
      expect(nowMine.title).toBe('Now mine')
    })
  })

  describe('lessons', () => {
    it('instructors see drafts of their courses only', async () => {
      const { docs } = await payload.find({ collection: 'lessons', draft: true, sort: 'title', ...as(instructor) })
      expect(docs.map((doc) => doc.title)).toEqual(['Assigned Draft Lesson', 'Assigned Lesson', 'Other Lesson'])
      const { docs: others } = await payload.find({ collection: 'lessons', draft: true, sort: 'title', ...as(otherInstructor) })
      expect(others.map((doc) => doc.title)).toEqual(['Assigned Lesson', 'Other Lesson'])
    })

    it('instructors create, edit, publish and delete lessons only in assigned courses', async () => {
      const created = await payload.create({
        collection: 'lessons',
        data: { course: assigned.id, order: 3, slug: '', title: 'New', _status: 'published' },
        ...as(instructor),
      })
      expect(created.title).toBe('New')
      await payload.update({ collection: 'lessons', id: draftLesson.id, data: { _status: 'published' }, ...as(instructor) })
      await payload.delete({ collection: 'lessons', id: created.id, ...as(instructor) })

      await expect(
        payload.create({
          collection: 'lessons',
          data: { course: unassigned.id, order: 3, slug: '', title: 'Sneaky', _status: 'published' },
          ...as(instructor),
        }),
      ).rejects.toThrow()
      await expect(
        payload.update({ collection: 'lessons', id: otherLesson.id, data: { title: 'Hijacked' }, ...as(instructor) }),
      ).rejects.toThrow()
    })

    it('instructors cannot move a lesson into an unassigned course', async () => {
      const moved = await payload.update({
        collection: 'lessons',
        id: lesson.id,
        data: { course: unassigned.id },
        depth: 0,
        ...as(instructor),
      })
      expect(moved.course).toBe(assigned.id)
    })

    it('instructors read content and quiz answers of assigned lessons without an enrollment', async () => {
      const own = await payload.findByID({ collection: 'lessons', id: lesson.id, ...as(instructor) })
      expect(own.content).toBeTruthy()
      expect(quizBlocks(own.content)[0].correctIndex).toBe(1)

      const other = await payload.findByID({ collection: 'lessons', id: otherLesson.id, ...as(instructor) })
      expect(other.content).toBeUndefined()

      const graded = await gradeQuizAttempt(payload, instructor, { lessonId: lesson.id, quizBlockId: QUIZ_ID, selectedIndex: 1 })
      expect(graded).toMatchObject({ ok: true, result: { correct: true } })
      expect(
        await gradeQuizAttempt(payload, instructor, { lessonId: otherLesson.id, quizBlockId: QUIZ_ID, selectedIndex: 1 }),
      ).toMatchObject({ ok: false })
    })

    it('learners get none of that', async () => {
      const doc = await payload.findByID({ collection: 'lessons', id: lesson.id, ...as(learner) })
      expect(doc.content).toBeUndefined()
      await expect(
        payload.update({ collection: 'lessons', id: lesson.id, data: { title: 'x' }, ...as(learner) }),
      ).rejects.toThrow()
    })
  })

  describe('media', () => {
    const upload = async (user: User) =>
      payload.create({ collection: 'media', data: { alt: 'Cover' }, file: await placeholderImage('c.png', { width: 8, height: 8 }), ...as(user) })

    it('instructors can upload and edit; only admins delete; learners cannot upload', async () => {
      const media = await upload(instructor)
      await payload.update({ collection: 'media', id: media.id, data: { alt: 'Better alt' }, ...as(instructor) })
      await expect(payload.delete({ collection: 'media', id: media.id, ...as(instructor) })).rejects.toThrow()
      await expect(upload(learner)).rejects.toThrow()
    })
  })

  describe('offerings', () => {
    it('instructors read every offering of assigned courses, and edit only their sessions', async () => {
      const read = await payload.findByID({ collection: 'offerings', id: offering.id, ...as(instructor) })
      expect(read.sessions?.[0]?.classLink).toBe('https://meet.example.com/a')

      const updated = await payload.update({
        collection: 'offerings',
        id: offering.id,
        data: {
          price: 1,
          seatPrice: 1,
          salesState: 'on_sale',
          salesOpenAt: '2020-01-01T00:00:00Z',
          title: 'Renamed',
          sessions: [
            ...(read.sessions ?? []),
            { title: 'S2', startsAt: '2030-01-08T17:00:00Z', endsAt: '2030-01-08T18:00:00Z', timezone: 'UTC', classLink: 'https://meet.example.com/b' },
          ],
        },
        ...as(instructor),
      })
      expect(updated.sessions).toHaveLength(2)
      expect(updated.price).toBe(49900)
      expect(updated.seatPrice ?? null).toBeNull()
      expect(updated.salesState).toBe('closed')
      expect(updated.salesOpenAt ?? null).toBeNull()
      expect(updated.title).toBe(offering.title)
      expect(updated.accessEndsAt).toBe('2030-07-08T18:00:00.000Z')
    })

    it('instructors cannot touch other courses’ offerings, or create or delete offerings', async () => {
      await expect(payload.findByID({ collection: 'offerings', id: otherOffering.id, ...as(instructor) })).rejects.toThrow()
      await expect(
        payload.update({ collection: 'offerings', id: otherOffering.id, data: { sessions: [] }, ...as(instructor) }),
      ).rejects.toThrow()
      await expect(
        payload.create({
          collection: 'offerings',
          data: { course: assigned.id, title: 'New', salesState: 'draft', currency: 'usd' },
          ...as(instructor),
        }),
      ).rejects.toThrow()
      await expect(payload.delete({ collection: 'offerings', id: offering.id, ...as(instructor) })).rejects.toThrow()
    })
  })

  describe('enrollments and quiz attempts', () => {
    it('instructors see only their own, like any learner, and cannot write them', async () => {
      await enroll(payload, learner, offering)
      const { docs } = await payload.find({ collection: 'enrollments', ...as(instructor) })
      expect(docs).toHaveLength(0)
      await expect(
        payload.create({
          collection: 'enrollments',
          data: { learner: instructor.id, offering: offering.id, course: assigned.id, source: 'manual', status: 'active', accessExpiresAt: '2099-01-01T00:00:00Z' },
          ...as(instructor),
        }),
      ).rejects.toThrow()

      const { docs: attempts } = await payload.find({ collection: 'quiz-attempts', ...as(instructor) })
      expect(attempts).toHaveLength(0)
    })
  })

  describe('admin panel', () => {
    it('admins and instructors may use it; learners may not', async () => {
      const users = payload.collections.users.config
      const canUse = (user: User) => users.access.admin!({ req: { user, payload } as never })
      expect(await canUse(admin)).toBe(true)
      expect(await canUse(instructor)).toBe(true)
      expect(await canUse(learner)).toBe(false)
    })

    it('hides users, enrollments and quiz attempts from instructors', () => {
      for (const slug of ['users', 'enrollments', 'quiz-attempts'] as const) {
        const hidden = payload.collections[slug].config.admin.hidden as (args: { user: User }) => boolean
        expect(hidden({ user: instructor })).toBe(true)
        expect(hidden({ user: admin })).toBe(false)
      }
      for (const slug of ['courses', 'lessons', 'offerings', 'media'] as const) {
        expect(payload.collections[slug].config.admin.hidden ?? false).toBe(false)
      }
    })
  })
})
