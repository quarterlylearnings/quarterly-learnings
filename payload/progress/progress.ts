import type { Payload } from 'payload'
import type { Course, Enrollment, Lesson } from '../../payload-types.ts'
import { relationId } from '../utilities/relationId.ts'

type MaybeUser = { id: string } | null | undefined

/**
 * Active enrollments (status active, access not yet expired), newest access
 * first. The first one per course is the one that holds progress (PRD §5.2).
 */
async function activeEnrollments(payload: Payload, userId: string, courseId?: string, now = new Date()) {
  const { docs } = await payload.find({
    collection: 'enrollments',
    where: {
      and: [
        { learner: { equals: userId } },
        { status: { equals: 'active' } },
        { accessExpiresAt: { greater_than: now.toISOString() } },
        ...(courseId ? [{ course: { equals: courseId } }] : []),
      ],
    },
    sort: '-accessExpiresAt',
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  return docs
}

/** The learner's enrollment that records progress for a course, if they have access. */
export async function progressEnrollment(
  payload: Payload,
  user: MaybeUser,
  courseId: string,
  now = new Date(),
): Promise<Enrollment | null> {
  if (!user) return null
  return (await activeEnrollments(payload, user.id, courseId, now))[0] ?? null
}

const completedIds = (enrollment: Enrollment | null) =>
  new Set((enrollment?.progress ?? []).map((entry) => relationId(entry.lesson)))

export async function isLessonComplete(payload: Payload, user: MaybeUser, courseId: string, lessonId: string) {
  return completedIds(await progressEnrollment(payload, user, courseId)).has(lessonId)
}

export type MarkCompleteOutcome = { ok: true; alreadyComplete: boolean } | { ok: false; error: string }

/**
 * Records a lesson as complete on the learner's current enrollment for its
 * course (PRD Appendix A.5). Safe to repeat: a lesson is listed at most once.
 * Learners have no write access to enrollments, so this is the only way in.
 */
export async function markLessonComplete(
  payload: Payload,
  user: MaybeUser,
  lessonId: string,
  now = new Date(),
): Promise<MarkCompleteOutcome> {
  if (!user) return { ok: false, error: 'Log in to track your progress.' }

  let lesson: Lesson
  try {
    lesson = await payload.findByID({ collection: 'lessons', id: String(lessonId), depth: 0, draft: false, overrideAccess: true })
  } catch {
    return { ok: false, error: 'We couldn’t find that lesson.' }
  }
  if (lesson._status !== 'published') return { ok: false, error: 'We couldn’t find that lesson.' }

  const enrollment = await progressEnrollment(payload, user, relationId(lesson.course)!, now)
  if (!enrollment) return { ok: false, error: 'Enroll in this course to track your progress.' }
  if (completedIds(enrollment).has(lesson.id)) return { ok: true, alreadyComplete: true }

  await payload.update({
    collection: 'enrollments',
    id: enrollment.id,
    data: {
      progress: [
        ...(enrollment.progress ?? []).map(({ lesson: done, completedAt }) => ({ lesson: relationId(done)!, completedAt })),
        { lesson: lesson.id, completedAt: now.toISOString() },
      ],
    },
    overrideAccess: true,
  })
  return { ok: true, alreadyComplete: false }
}

export type CourseProgress = {
  course: Pick<Course, 'id' | 'title' | 'slug'>
  completed: number
  total: number
  /** First lesson in outline order not yet complete; null when all are done. */
  nextLesson: Pick<Lesson, 'title' | 'slug'> | null
}

/** One row per course the learner can access, for /progress (PRD §3.3 R8, §5.2). */
export async function courseProgress(payload: Payload, user: MaybeUser, now = new Date()): Promise<CourseProgress[]> {
  if (!user) return []
  const byCourse = new Map<string, Enrollment>()
  for (const enrollment of await activeEnrollments(payload, user.id, undefined, now)) {
    const courseId = relationId(enrollment.course)!
    if (!byCourse.has(courseId)) byCourse.set(courseId, enrollment)
  }
  if (byCourse.size === 0) return []

  const { docs: courses } = await payload.find({
    collection: 'courses',
    where: { and: [{ id: { in: [...byCourse.keys()] } }, { _status: { equals: 'published' } }] },
    select: { title: true, slug: true },
    sort: 'title',
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  return Promise.all(
    courses.map(async (course) => {
      const { docs: lessons } = await payload.find({
        collection: 'lessons',
        where: { and: [{ course: { equals: course.id } }, { _status: { equals: 'published' } }] },
        select: { title: true, slug: true },
        sort: ['order', 'createdAt'],
        pagination: false,
        depth: 0,
        overrideAccess: true,
      })
      const done = completedIds(byCourse.get(course.id)!)
      const remaining = lessons.filter((lesson) => !done.has(lesson.id))
      return {
        course: { id: course.id, title: course.title, slug: course.slug },
        completed: lessons.length - remaining.length,
        total: lessons.length,
        nextLesson: remaining[0] ? { title: remaining[0].title, slug: remaining[0].slug } : null,
      }
    }),
  )
}
