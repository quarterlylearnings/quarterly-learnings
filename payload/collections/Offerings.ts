import type { CollectionConfig, Validate } from 'payload'
import { isAdmin } from '../access/isAdmin.ts'
import { onSaleOrAdmin } from '../access/onSaleOrAdmin.ts'
import { SALES_STATES } from '../utilities/offerings.ts'

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

/** A scheduled, sellable run of a course. Price lives here, not on the course (PRD §3.1). */
export const Offerings: CollectionConfig = {
  slug: 'offerings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'course', 'salesState', 'price', 'updatedAt'],
  },
  access: {
    read: onSaleOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'For example, "November 2026 cohort".' } },
    { name: 'course', type: 'relationship', relationTo: 'courses', required: true, index: true },
    {
      name: 'salesState',
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
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' }, description: 'Leave empty to open sales immediately.' },
        },
        {
          name: 'salesCloseAt',
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
          type: 'number',
          validate: validatePrice,
          admin: { description: 'In cents (49900 = $499). Required unless the offering is a Draft.' },
        },
        {
          name: 'seatPrice',
          type: 'number',
          validate: validateSeatPrice,
          admin: { description: 'Per seat, in cents. Leave empty to turn off team seat purchases.' },
        },
        {
          name: 'currency',
          type: 'select',
          required: true,
          defaultValue: 'usd',
          options: [{ label: 'USD', value: 'usd' }],
        },
      ],
    },
  ],
}
