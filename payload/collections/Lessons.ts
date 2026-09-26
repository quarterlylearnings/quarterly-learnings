import { ValidationError, type CollectionBeforeChangeHook, type CollectionConfig } from 'payload'
import { canReadLessonContent } from '../access/canReadLessonContent.ts'
import { isAdmin } from '../access/isAdmin.ts'
import { publishedOrAdmin } from '../access/publishedOrAdmin.ts'
import { slugify } from '../utilities/slugify.ts'

const idOf = (value: unknown): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'object' && 'id' in value) return String((value as { id: unknown }).id)
  return String(value)
}

/**
 * Lesson slugs are unique within a course, not globally: two courses can both
 * have an "introduction" lesson (PRD §5.1).
 */
export const slugUniqueWithinCourse: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const slug = data.slug ?? originalDoc?.slug
  const course = idOf(data.course ?? originalDoc?.course)
  if (!slug || !course) return data

  const { docs } = await req.payload.find({
    collection: 'lessons',
    where: {
      and: [
        { course: { equals: course } },
        { slug: { equals: slug } },
        ...(originalDoc?.id ? [{ id: { not_equals: originalDoc.id } }] : []),
      ],
    },
    limit: 1,
    depth: 0,
    pagination: false,
    overrideAccess: true,
    req,
  })
  if (docs.length > 0) {
    throw new ValidationError({
      collection: 'lessons',
      errors: [{ path: 'slug', message: `Another lesson in this course already uses the slug "${slug}".` }],
      req,
    })
  }
  return data
}

/** Ordered content within a course. Publish state uses Payload drafts. */
export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'order', 'preview', '_status'],
  },
  defaultSort: 'order',
  versions: { drafts: true },
  access: {
    read: publishedOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [slugUniqueWithinCourse],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'URL segment, unique within the course. Generated from the title when left blank.',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) =>
            value ? slugify(String(value)) : siblingData?.title ? slugify(String(siblingData.title)) : value,
        ],
      },
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 1,
      admin: { position: 'sidebar', description: 'Position in the course outline, lowest first.' },
    },
    {
      name: 'estimatedMinutes',
      type: 'number',
      min: 1,
      admin: { position: 'sidebar' },
    },
    {
      name: 'preview',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Free preview: anyone can read this lesson without enrolling.' },
    },
    {
      name: 'content',
      type: 'richText',
      access: { read: canReadLessonContent },
    },
  ],
}
