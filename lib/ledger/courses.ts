import type { Payload } from 'payload'
import { cache } from 'react'
import type { Course, Lesson, User } from '@/payload-types'
import { getViewer } from './payload'

export type OutlineLesson = Pick<Lesson, 'id' | 'title' | 'slug' | 'order' | 'estimatedMinutes' | 'preview'>

/**
 * Learner pages show published content only, even to admins: the `_status`
 * filter keeps drafts off the site, and `overrideAccess: false` applies the
 * collection rules (PRD §4.5). Cached per request so `generateMetadata` and the
 * page share one lookup.
 */
export const getCourseBySlug = cache(async (slug: string): Promise<Course | null> => {
  const { payload, user } = await getViewer()
  const { docs } = await payload.find({
    collection: 'courses',
    draft: false,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1,
    user,
    overrideAccess: false,
  })
  return docs[0] ?? null
})

/** Published lessons of a course in outline order, without their content. */
export async function getOutline(payload: Payload, user: User | null, courseId: string): Promise<OutlineLesson[]> {
  const { docs } = await payload.find({
    collection: 'lessons',
    draft: false,
    where: { and: [{ course: { equals: courseId } }, { _status: { equals: 'published' } }] },
    select: { title: true, slug: true, order: true, estimatedMinutes: true, preview: true },
    sort: ['order', 'createdAt'],
    pagination: false,
    depth: 0,
    user,
    overrideAccess: false,
  })
  return docs
}

/**
 * One published lesson of a course. `content` is present only when the viewer
 * may read it; the field access on `lessons.content` strips it otherwise.
 */
export const getLesson = cache(async (courseId: string, slug: string): Promise<Lesson | null> => {
  const { payload, user } = await getViewer()
  const { docs } = await payload.find({
    collection: 'lessons',
    draft: false,
    where: {
      and: [{ course: { equals: courseId } }, { slug: { equals: slug } }, { _status: { equals: 'published' } }],
    },
    limit: 1,
    depth: 0,
    user,
    overrideAccess: false,
  })
  return docs[0] ?? null
})
