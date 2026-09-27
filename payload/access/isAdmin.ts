import type { Access, FieldAccess } from 'payload'

type MaybeUser = { role?: string | null } | null | undefined

export const userIsAdmin = (user: MaybeUser): boolean => user?.role === 'admin'

/** Collection access: admins only. */
export const isAdmin: Access = ({ req: { user } }) => userIsAdmin(user)

/** Field access: admins only. */
export const isAdminField: FieldAccess = ({ req: { user } }) => userIsAdmin(user)
