import type { Access, PayloadRequest, Where } from 'payload'
import { userIsAdmin } from './isAdmin.ts'

type MaybeUser = { id: string | number; role?: string | null } | null | undefined

export const userIsInstructor = (user: MaybeUser): boolean => user?.role === 'instructor'

/** Admins and instructors may use /admin; instructors see only their courses there (PRD §10, DEV-96). */
export const canUseAdminPanel = (user: MaybeUser): boolean => userIsAdmin(user) || userIsInstructor(user)

/** Hides a collection from the admin nav for everyone but admins. */
export const hiddenFromNonAdmins = ({ user }: { user: MaybeUser }) => !userIsAdmin(user)

/**
 * Ids of the courses an instructor is assigned to (`courses.instructors`).
 * Cached on the request, since access runs once per document and field.
 */
export async function assignedCourseIds(req: Partial<PayloadRequest> & Pick<PayloadRequest, 'payload'>): Promise<string[]> {
  const user = req.user as MaybeUser
  if (!userIsInstructor(user)) return []
  const cacheKey = `assignedCourseIds:${user!.id}`
  const cached = req.context?.[cacheKey] as Promise<string[]> | undefined
  if (cached) return cached

  const lookup = req.payload
    .find({
      collection: 'courses',
      where: { instructors: { in: [user!.id] } },
      select: {},
      pagination: false,
      depth: 0,
      overrideAccess: true,
      req,
    })
    .then(({ docs }) => docs.map((doc) => String(doc.id)))
  if (req.context) req.context[cacheKey] = lookup
  return lookup
}

/** True when the request's user is an instructor assigned to this course. */
export async function isAssignedInstructor(
  req: Partial<PayloadRequest> & Pick<PayloadRequest, 'payload'>,
  courseId: string | undefined,
): Promise<boolean> {
  if (!courseId || !userIsInstructor(req.user as MaybeUser)) return false
  return (await assignedCourseIds(req)).includes(String(courseId))
}

/**
 * Collection access for content that belongs to a course through `field`:
 * admins everything, assigned instructors their courses' docs, others nothing.
 */
export const adminOrAssignedBy =
  (field: 'id' | 'course'): Access =>
  async ({ req }) => {
    if (userIsAdmin(req.user)) return true
    if (!userIsInstructor(req.user)) return false
    return { [field]: { in: await assignedCourseIds(req) } } as Where
  }

/** Admin list view: instructors see only their courses' docs (PRD: "sees only assigned courses"). */
export const assignedOnlyForInstructors =
  (field: 'id' | 'course') =>
  async ({ req }: { req: PayloadRequest }): Promise<Where | null> =>
    userIsInstructor(req.user) ? ({ [field]: { in: await assignedCourseIds(req) } } as Where) : null
