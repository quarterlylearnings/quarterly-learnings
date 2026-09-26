import type { Payload } from 'payload'
import type { Offering, User } from '@/payload-types'

/** The offering fields a course page may show. Never class links or Stripe ids. */
export type PublicOffering = Pick<
  Offering,
  'id' | 'title' | 'salesState' | 'salesOpenAt' | 'salesCloseAt' | 'price' | 'seatPrice' | 'currency'
>

const publicSelect = {
  title: true,
  salesState: true,
  salesOpenAt: true,
  salesCloseAt: true,
  price: true,
  seatPrice: true,
  currency: true,
} as const

// Sessions arrive in DEV-93; until then "soonest first" follows the sales window.
const byOpening = (a: PublicOffering, b: PublicOffering) =>
  (a.salesOpenAt ?? '').localeCompare(b.salesOpenAt ?? '') || a.title.localeCompare(b.title)

/**
 * Offerings to show on a course page (PRD §3.2 R2): every On sale offering,
 * plus the Unlisted one named by `?offering=`. The Unlisted lookup uses
 * `overrideAccess` because the public API must never return it, so it is
 * checked here by exact id, course and state instead.
 */
export async function getCourseOfferings(
  payload: Payload,
  user: User | null,
  courseId: string,
  requestedId?: string,
): Promise<PublicOffering[]> {
  const { docs: onSale } = await payload.find({
    collection: 'offerings',
    where: { and: [{ course: { equals: courseId } }, { salesState: { equals: 'on_sale' } }] },
    select: publicSelect,
    pagination: false,
    depth: 0,
    user,
    overrideAccess: false,
  })

  const unlisted = requestedId ? await findUnlisted(payload, courseId, requestedId) : null
  return [...(unlisted ? [unlisted] : []), ...onSale.sort(byOpening)]
}

async function findUnlisted(payload: Payload, courseId: string, id: string): Promise<PublicOffering | null> {
  try {
    const { docs } = await payload.find({
      collection: 'offerings',
      where: {
        and: [{ id: { equals: id } }, { course: { equals: courseId } }, { salesState: { equals: 'unlisted' } }],
      },
      select: publicSelect,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    return docs[0] ?? null
  } catch {
    // A malformed id is just an unknown offering.
    return null
  }
}
