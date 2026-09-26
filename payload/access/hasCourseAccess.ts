import type { Payload, PayloadRequest } from 'payload'

type MaybeUser = { id: string | number } | null | undefined

export type CourseAccess =
  | { state: 'active'; expiresAt: Date }
  | { state: 'expired'; endedAt: Date }
  | { state: 'none' }

/**
 * The viewer's access to a course (PRD §5.2, §10). "Active" means an
 * enrollment in any offering of the course with `status = active` and
 * `accessExpiresAt` in the future. An active-status enrollment whose date has
 * passed is "expired", so the lesson page can say when access ended; refunded
 * and revoked enrollments count as no access.
 */
export async function courseAccess(
  payload: Payload,
  user: MaybeUser,
  courseId: string,
  req?: Partial<PayloadRequest>,
  now = new Date(),
): Promise<CourseAccess> {
  if (!user) return { state: 'none' }
  const { docs } = await payload.find({
    collection: 'enrollments',
    where: {
      and: [
        { learner: { equals: user.id } },
        { course: { equals: courseId } },
        { status: { equals: 'active' } },
      ],
    },
    select: { accessExpiresAt: true },
    sort: '-accessExpiresAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const latest = docs[0]
  if (!latest) return { state: 'none' }
  const expiresAt = new Date(latest.accessExpiresAt)
  return expiresAt > now ? { state: 'active', expiresAt } : { state: 'expired', endedAt: expiresAt }
}

/** True when the viewer may read every lesson of the course. */
export async function hasCourseAccess(
  payload: Payload,
  user: MaybeUser,
  courseId: string,
  req?: Partial<PayloadRequest>,
): Promise<boolean> {
  return (await courseAccess(payload, user, courseId, req)).state === 'active'
}
