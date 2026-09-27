import type { Access, CollectionBeforeChangeHook, CollectionConfig, FieldAccess } from 'payload'
import {
  adminOrAssignedBy,
  assignedCourseIds,
  assignedOnlyForInstructors,
  userIsInstructor,
} from '../access/instructor.ts'
import { isAdmin, isAdminField, userIsAdmin } from '../access/isAdmin.ts'
import { slugify } from '../utilities/slugify.ts'

/**
 * Published courses are public; admins see drafts; instructors also see the
 * drafts of courses they're assigned to (PRD §5.3, DEV-96).
 */
const readCourses: Access = async ({ req }) => {
  if (userIsAdmin(req.user)) return true
  const published = { _status: { equals: 'published' } }
  if (!userIsInstructor(req.user)) return published
  return { or: [published, { id: { in: await assignedCourseIds(req) } }] }
}

const adminOrInstructor: Access = ({ req: { user } }) => userIsAdmin(user) || userIsInstructor(user)

/** An instructor who creates a course is its instructor; only admins assign anyone else. */
const assignCreatingInstructor: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && userIsInstructor(req.user) && req.user) return { ...data, instructors: [req.user.id] }
  return data
}

/** On create, instructors may only list themselves (the hook above does it); otherwise admins only. */
const canSetInstructorsOnCreate: FieldAccess = ({ req: { user }, data }) => {
  if (userIsAdmin(user)) return true
  if (!userIsInstructor(user) || !user) return false
  const ids = ((data?.instructors as unknown[]) ?? []).map(String)
  return ids.length === 0 || (ids.length === 1 && ids[0] === String(user.id))
}

export const COURSE_LEVELS = ['beginner', 'intermediate', 'advanced'] as const

/** Course content container. No price here — prices live on Offerings (PRD §3.1). */
export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'level', '_status', 'updatedAt'],
    baseFilter: assignedOnlyForInstructors('id'),
  },
  versions: { drafts: true },
  access: {
    read: readCourses,
    create: adminOrInstructor,
    update: adminOrAssignedBy('id'),
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [assignCreatingInstructor],
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
    {
      name: 'instructors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      index: true,
      filterOptions: { role: { equals: 'instructor' } },
      access: { create: canSetInstructorsOnCreate, update: isAdminField },
      admin: {
        position: 'sidebar',
        description:
          'Instructors can edit this course, its lessons and its sessions. On a published course, a change here applies when you publish, not when you save a draft.',
      },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar', description: 'Shown on /courses and the course page.' },
    },
  ],
}
