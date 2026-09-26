import type { FieldAccess } from 'payload'
import { hasCourseAccess } from './hasCourseAccess.ts'
import { userIsAdmin } from './isAdmin.ts'
import { relationId } from '../utilities/relationId.ts'

/**
 * Field read access for `lessons.content` (PRD §5.3): admins, anyone when the
 * lesson is a preview, and learners with active access to its course.
 */
export const canReadLessonContent: FieldAccess = async ({ req, doc }) => {
  if (userIsAdmin(req.user)) return true
  if (doc?.preview === true) return true
  const course = relationId(doc?.course)
  if (!req.user || !course) return false
  return hasCourseAccess(req.payload, req.user, course, req)
}
