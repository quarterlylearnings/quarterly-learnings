import type { Payload } from 'payload'
import type { Offering, User } from '@/payload-types'
import { activeOfferingIds } from '@/payload/access/hasOfferingAccess'

type Session = NonNullable<Offering['sessions']>[number]

/** A session as the public may see it: never the class link. */
export type PublicSession = Omit<Session, 'classLink'>

/** The offering fields a course page may show. Never class links or Stripe ids. */
export type PublicOffering = Pick<
  Offering,
  'id' | 'title' | 'salesState' | 'salesOpenAt' | 'salesCloseAt' | 'price' | 'seatPrice' | 'currency'
> & { sessions?: PublicSession[] | null }

// `classLink` is left out on purpose: the Unlisted lookup skips field access.
const publicSelect = {
  title: true,
  salesState: true,
  salesOpenAt: true,
  salesCloseAt: true,
  price: true,
  seatPrice: true,
  currency: true,
  sessions: { id: true, title: true, startsAt: true, endsAt: true, timezone: true },
} as const

/** Earliest session start, else when sales open: the "soonest first" key (PRD §3.2 R2). */
export const firstSession = (offering: Pick<PublicOffering, 'sessions'>) =>
  [...(offering.sessions ?? [])].sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0] ?? null

const soonestKey = (offering: PublicOffering) => firstSession(offering)?.startsAt ?? offering.salesOpenAt ?? ''

const bySoonest = (a: PublicOffering, b: PublicOffering) =>
  soonestKey(a).localeCompare(soonestKey(b)) || a.title.localeCompare(b.title)

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
  return [...(unlisted ? [unlisted] : []), ...onSale.sort(bySoonest)]
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

/**
 * The viewer's own offerings of a course, in any sales state (R2). Read with
 * the viewer's access, so each session's `classLink` is present only inside
 * its window (field access on offerings).
 */
export async function getEnrolledOfferings(payload: Payload, user: User | null, courseId: string): Promise<Offering[]> {
  if (!user) return []
  const ids = await activeOfferingIds(payload, user)
  if (ids.length === 0) return []
  const { docs } = await payload.find({
    collection: 'offerings',
    where: { and: [{ id: { in: ids } }, { course: { equals: courseId } }] },
    pagination: false,
    depth: 0,
    user,
    overrideAccess: false,
  })
  return docs
}
