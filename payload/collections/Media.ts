import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import { userIsInstructor } from '../access/instructor.ts'
import { isAdmin, userIsAdmin } from '../access/isAdmin.ts'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Images and handouts. Stored in R2 (payload/storage.ts); the local directory
 * is only used by tests and `npm run dev:local`, which run without R2.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  access: {
    // Course covers are public. Gated handouts would need their own rule.
    read: () => true,
    // Instructors upload and edit media; deleting (it may be used elsewhere) stays with admins.
    create: ({ req: { user } }) => userIsAdmin(user) || userIsInstructor(user),
    update: ({ req: { user } }) => userIsAdmin(user) || userIsInstructor(user),
    delete: isAdmin,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../tmp/media'),
    mimeTypes: ['image/*', 'application/pdf'],
    imageSizes: [{ name: 'card', width: 800 }],
    adminThumbnail: 'card',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for people who can’t see it.' },
    },
  ],
}
