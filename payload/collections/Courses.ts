import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin.ts'
import { publishedOrAdmin } from '../access/publishedOrAdmin.ts'
import { slugify } from '../utilities/slugify.ts'

export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

/** Course content container. No price here — prices live on Offerings (PRD §3.1). */
export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'level', '_status', 'updatedAt'],
  },
  versions: { drafts: true },
  access: {
    read: publishedOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'URL segment. Generated from the title when left blank.' },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) =>
            value ? slugify(String(value)) : siblingData?.title ? slugify(String(siblingData.title)) : value,
        ],
      },
    },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'level',
      type: 'select',
      required: true,
      defaultValue: 'beginner',
      options: COURSE_LEVELS.map((value) => ({ label: value[0].toUpperCase() + value.slice(1), value })),
    },
  ],
}
