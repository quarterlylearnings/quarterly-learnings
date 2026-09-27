import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import {
  ValidationError,
  type Access,
  type CollectionBeforeChangeHook,
  type CollectionConfig,
  type FieldAccess,
} from 'payload'
import { canReadLessonContent } from '../access/canReadLessonContent.ts'
import { adminOrAssignedBy, assignedCourseIds, assignedOnlyForInstructors, isAssignedInstructor, userIsInstructor } from '../access/instructor.ts'
import { userIsAdmin } from '../access/isAdmin.ts'
import { CodeBlock } from '../blocks/CodeBlock.ts'
import { QuizBlock } from '../blocks/QuizBlock.ts'
import { stripQuizAnswers } from '../quiz/answers.ts'
import { slugify } from '../utilities/slugify.ts'
import { relationId } from '../utilities/relationId.ts'

/**
 * Lesson slugs are unique within a course, not globally: two courses can both
 * have an "introduction" lesson (PRD §5.1).
 */
export const slugUniqueWithinCourse: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const slug = data.slug ?? originalDoc?.slug
  const course = relationId(data.course ?? originalDoc?.course)
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

/** Published lessons are public; admins see drafts; instructors see drafts of their courses. */
const readLessons: Access = async ({ req }) => {
  if (userIsAdmin(req.user)) return true
  const published = { _status: { equals: 'published' } }
  if (!userIsInstructor(req.user)) return published
  return { or: [published, { course: { in: await assignedCourseIds(req) } }] }
}

/** Instructors may create lessons only in courses they're assigned to. */
const createLessons: Access = async ({ req, data }) =>
  userIsAdmin(req.user) || isAssignedInstructor(req, relationId(data?.course))

/** Instructors can't move a lesson into a course they aren't assigned to. */
const canSetCourse: FieldAccess = async ({ req, data, siblingData }) =>
  userIsAdmin(req.user) || isAssignedInstructor(req, relationId(siblingData?.course ?? data?.course))

/** Ordered content within a course. Publish state uses Payload drafts. */
export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'order', 'preview', '_status'],
    baseFilter: assignedOnlyForInstructors('course'),
  },
  defaultSort: 'order',
  versions: { drafts: true },
  access: {
    read: readLessons,
    create: createLessons,
    update: adminOrAssignedBy('course'),
    delete: adminOrAssignedBy('course'),
  },
  hooks: {
    beforeChange: [slugUniqueWithinCourse],
    afterRead: [stripQuizAnswers],
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
      access: { create: canSetCourse, update: canSetCourse },
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
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [CodeBlock, QuizBlock] })],
      }),
    },
  ],
}
