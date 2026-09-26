import type { Access } from 'payload'
import { userIsAdmin } from './isAdmin.ts'

/**
 * Offerings read access (PRD §5.3): the public sees On sale offerings only.
 * Unlisted ones are never readable through the API; the course page loads one
 * by exact id on the server. Enrolled learners' own offerings are added in DEV-93.
 */
export const onSaleOrAdmin: Access = ({ req: { user } }) => {
  if (userIsAdmin(user)) return true
  return { salesState: { equals: 'on_sale' } }
}
