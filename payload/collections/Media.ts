import path from 'path'
import type { CollectionConfig } from 'payload'
import { fileURLToPath } from 'url'
import { isAdmin } from '../access/isAdmin.ts'

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
    create: isAdmin,
    update: isAdmin,
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
