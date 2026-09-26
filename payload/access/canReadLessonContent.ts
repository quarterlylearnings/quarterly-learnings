import type { FieldAccess } from 'payload'
import { userIsAdmin } from './isAdmin.ts'

/**
 * Field read access for `lessons.content` (PRD §5.3): admins always, anyone
 * when the lesson is a preview. Enrollment access is added in DEV-89.
 */
export const canReadLessonContent: FieldAccess = ({ req: { user }, doc }) => {
  if (userIsAdmin(user)) return true
  return doc?.preview === true
}
