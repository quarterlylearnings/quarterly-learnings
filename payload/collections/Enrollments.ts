import type { Access, CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { isAdmin, userIsAdmin } from '../access/isAdmin.ts'
import { relationId } from '../utilities/relationId.ts'

export const ENROLLMENT_SOURCES = ['individual', 'buyer', 'seat', 'manual'] as const
export const ENROLLMENT_STATUSES = ['active', 'refunded', 'revoked'] as const

const label = (value: string) => value[0].toUpperCase() + value.slice(1)

/** Learners read only their own enrollments; admins read all (PRD §5.3). */
const ownOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (userIsAdmin(user)) return true
  return { learner: { equals: user.id } }
}

/** `course` is denormalized from the offering for queries, so it always follows the offering. */
const courseFromOffering: CollectionBeforeValidateHook = async ({ data, originalDoc, req }) => {
  const offeringId = relationId(data?.offering ?? originalDoc?.offering)
  if (!offeringId) return data
  const doc = await req.payload.findByID({
    collection: 'offerings',
    id: offeringId,
    depth: 0,
    select: { course: true },
    overrideAccess: true,
    req,
  })
  return { ...data, course: doc.course }
}

/**
 * A learner's access to one offering, and through it to the offering's course.
 * Created by admins (`manual`) now; checkout, seat claims and buyers later.
 */
export const Enrollments: CollectionConfig = {
  slug: 'enrollments',
  admin: {
    defaultColumns: ['learner', 'offering', 'status', 'source', 'accessExpiresAt'],
  },
  access: {
    read: ownOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  // A person holds at most one enrollment per offering (PRD §3.5 R12).
  indexes: [{ fields: ['learner', 'offering'], unique: true }],
  hooks: {
    beforeValidate: [courseFromOffering],
  },
  fields: [
    { name: 'learner', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'offering', type: 'relationship', relationTo: 'offerings', required: true, index: true },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
      admin: { readOnly: true, description: 'Set from the offering.' },
    },
    {
      name: 'source',
      type: 'select',
      required: true,
      defaultValue: 'manual',
      options: ENROLLMENT_SOURCES.map((value) => ({ label: label(value), value })),
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      index: true,
      options: ENROLLMENT_STATUSES.map((value) => ({ label: label(value), value })),
      admin: { position: 'sidebar', description: 'Refunded or revoked enrollments lock the course.' },
    },
    {
      name: 'accessExpiresAt',
      type: 'date',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Lessons lock after this date.',
      },
    },
  ],
}
