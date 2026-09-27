import type {
  CollectionAfterChangeHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
  FieldAccess,
  Validate,
} from 'payload'
import { hasOfferingAccess } from '../access/hasOfferingAccess.ts'
import { adminOrAssignedBy, assignedOnlyForInstructors, isAssignedInstructor } from '../access/instructor.ts'
import { isAdmin, isAdminField, userIsAdmin } from '../access/isAdmin.ts'
import { relationId } from '../utilities/relationId.ts'
import { onSaleOrAdmin } from '../access/onSaleOrAdmin.ts'
import { SALES_STATES } from '../utilities/offerings.ts'
import { accessEndsAt, classLinkWindow, enrollmentExpiresAt, isTimeZone } from '../utilities/sessions.ts'

const SALES_STATE_LABELS: Record<(typeof SALES_STATES)[number], string> = {
  draft: 'Draft',
  unlisted: 'Unlisted (direct link only)',
  on_sale: 'On sale',
  closed: 'Closed',
}

const isEmpty = (value: unknown) => value === null || value === undefined || value === ''

/** `price` is optional while drafting and required once the offering leaves Draft (PRD §3.7 R21). */
const validatePrice: Validate<number> = (value, { siblingData }) => {
  const state = (siblingData as { salesState?: string }).salesState ?? 'draft'
  if (isEmpty(value)) return state === 'draft' ? true : 'Set a price before moving the offering out of Draft.'
  if (!Number.isInteger(value) || (value as number) < 0) return 'Enter the price in whole cents, e.g. 49900 for $499.'
  return true
}

const validateSeatPrice: Validate<number> = (value) => {
  if (isEmpty(value)) return true
  if (!Number.isInteger(value) || (value as number) < 0) return 'Enter the seat price in whole cents.'
  return true
}

const validateSalesClose: Validate<Date | string> = (value, { siblingData }) => {
  const opensAt = (siblingData as { salesOpenAt?: Date | string | null }).salesOpenAt
  if (value && opensAt && new Date(value) <= new Date(opensAt)) return 'Sales must close after they open.'
  return true
}

const validateEndsAt: Validate<Date | string> = (value, { siblingData }) => {
  const startsAt = (siblingData as { startsAt?: Date | string | null }).startsAt
  if (!value) return 'Set when the session ends.'
  if (startsAt && new Date(value) <= new Date(startsAt)) return 'The session must end after it starts.'
  return true
}

const validateTimeZone: Validate<string> = (value) =>
  isTimeZone(value) || 'Use an IANA time zone name, such as America/New_York or Europe/London.'

const validateClassLink: Validate<string> = (value) => {
  if (!value) return 'Add the class link.'
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? true : 'Use a web link starting with https://.'
  } catch {
    return 'Use a full web link, such as https://zoom.us/j/123.'
  }
}

/**
 * A session's class link is readable by admins and the course's instructors,
 * and by learners actively enrolled in this offering from 24 hours before the
 * start until the end (PRD §5.2, §5.3). Evaluated per session row, at read
 * time; never stored.
 */
const canReadClassLink: FieldAccess = async ({ req, doc, siblingData }) => {
  if (userIsAdmin(req.user)) return true
  if (await isAssignedInstructor(req, relationId(doc?.course))) return true
  const session = siblingData as { startsAt?: string; endsAt?: string } | undefined
  if (!req.user || !doc?.id || !session?.startsAt || !session.endsAt) return false
  if (classLinkWindow({ startsAt: session.startsAt, endsAt: session.endsAt }) !== 'open') return false
  return hasOfferingAccess(req.payload, req.user, String(doc.id), req)
}

/** `accessEndsAt` = latest session end + 6 calendar months (UTC), null without sessions. */
const computeAccessEndsAt: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const sessions = data.sessions ?? originalDoc?.sessions
  return { ...data, accessEndsAt: accessEndsAt(sessions) }
}

/**
 * When sessions move `accessEndsAt`, every enrollment in the offering follows
 * (PRD §5.2). Seat pools' `claimDeadline` joins this in DEV-99.
 */
const recomputeEnrollmentAccess: CollectionAfterChangeHook = async ({ doc, previousDoc, operation, req }) => {
  if (operation !== 'update') return doc
  const before = previousDoc?.accessEndsAt ? new Date(previousDoc.accessEndsAt).toISOString() : null
  const after = doc.accessEndsAt ? new Date(doc.accessEndsAt).toISOString() : null
  if (before === after) return doc

  const { docs: enrollments } = await req.payload.find({
    collection: 'enrollments',
    where: { offering: { equals: doc.id } },
    select: { createdAt: true },
    pagination: false,
    depth: 0,
    overrideAccess: true,
    req,
  })
  for (const enrollment of enrollments) {
    await req.payload.update({
      collection: 'enrollments',
      id: enrollment.id,
      data: { accessExpiresAt: enrollmentExpiresAt(after, enrollment.createdAt) },
      overrideAccess: true,
      req,
    })
  }
  return doc
}

/** A scheduled, sellable run of a course. Price lives here, not on the course (PRD §3.1). */
export const Offerings: CollectionConfig = {
  slug: 'offerings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'salesState', 'price', 'updatedAt'],
    baseFilter: assignedOnlyForInstructors('course'),
  },
  access: {
    read: onSaleOrAdmin,
    create: isAdmin,
    // Instructors edit their courses' offerings, but only `sessions` (field access below).
    update: adminOrAssignedBy('course'),
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [computeAccessEndsAt],
    afterChange: [recomputeEnrollmentAccess],
  },
  fields: [
    { name: 'title', type: 'text', required: true, access: { update: isAdminField }, admin: { description: 'For example, "November 2026 cohort".' } },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
      access: { update: isAdminField },
    },
    {
      name: 'salesState',
      access: { update: isAdminField },
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: SALES_STATES.map((value) => ({ label: SALES_STATE_LABELS[value], value })),
      admin: { position: 'sidebar' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'salesOpenAt',
          access: { update: isAdminField },
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'Leave empty to open sales immediately.' },
        },
        {
          name: 'salesCloseAt',
          access: { update: isAdminField },
          type: 'date',
          validate: validateSalesClose,
          admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'Leave empty to keep sales open.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          access: { update: isAdminField },
          type: 'number',
          validate: validatePrice,
          admin: { description: 'In cents (49900 = $499). Required unless the offering is a Draft.' },
        },
        {
          name: 'seatPrice',
          access: { update: isAdminField },
          type: 'number',
          validate: validateSeatPrice,
          admin: { description: 'Per seat, in cents. Leave empty to turn off team seat purchases.' },
        },
        {
          name: 'currency',
          access: { update: isAdminField },
          type: 'select',
          required: true,
          defaultValue: 'usd',
          options: [{ label: 'USD', value: 'usd' }],
        },
      ],
    },
    {
      name: 'sessions',
      type: 'array',
      admin: { description: 'Live sessions. Enrolled learners see the class link from 24 hours before each start.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            { name: 'startsAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
            {
              name: 'endsAt',
              type: 'date',
              required: true,
              validate: validateEndsAt,
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'timezone',
              type: 'text',
              required: true,
              validate: validateTimeZone,
              admin: { description: 'For display, e.g. America/New_York.' },
            },
          ],
        },
        {
          name: 'classLink',
          type: 'text',
          required: true,
          validate: validateClassLink,
          access: { read: canReadClassLink },
          admin: { description: 'Zoom, Meet or similar.' },
        },
      ],
    },
    {
      name: 'accessEndsAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Last session end + 6 months. Enrollments in this offering expire then.',
      },
    },
  ],
}
