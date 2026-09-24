import type { CollectionConfig } from 'payload'
import { isAdminField, userIsAdmin } from '../access/isAdmin.ts'
import { isAdminOrSelf } from '../access/isAdminOrSelf.ts'

export const ROLES = ['admin', 'instructor', 'learner'] as const

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
  },
  access: {
    // Sign-up is public; the hook below decides the role.
    create: () => true,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
    delete: ({ req: { user } }) => userIsAdmin(user),
    // Instructors get panel access in DEV-96.
    admin: ({ req: { user } }) => userIsAdmin(user),
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        // The very first account (Payload's create-first-user screen) must be able
        // to reach /admin, so it becomes an admin. After that, only admins can
        // hand out roles; everyone else signs up as a learner.
        // The `where` forces countDocuments; an unfiltered count uses
        // estimatedDocumentCount, which Mongo rejects inside the create transaction.
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          where: { id: { exists: true } },
          req,
        })
        if (totalDocs === 0) return { ...data, role: 'admin' }
        if (!userIsAdmin(req.user)) return { ...data, role: 'learner' }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'learner',
      options: ROLES.map((value) => ({ label: value[0].toUpperCase() + value.slice(1), value })),
      access: { create: isAdminField, update: isAdminField },
      saveToJWT: true,
    },
  ],
}
