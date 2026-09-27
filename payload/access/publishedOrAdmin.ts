import type { Access } from 'payload'
import { userIsAdmin } from './isAdmin.ts'

/** Read access for draft-enabled collections: admins see drafts, everyone else only published docs. */
export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (userIsAdmin(user)) return true
  return { _status: { equals: 'published' } }
}
