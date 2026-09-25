import type { Access } from 'payload'
import { userIsAdmin } from './isAdmin.ts'

/** Admins see every user; everyone else only their own document. */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (userIsAdmin(user)) return true
  return { id: { equals: user.id } }
}
