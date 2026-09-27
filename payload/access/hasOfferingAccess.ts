import type { Payload, PayloadRequest } from 'payload'

type MaybeUser = { id: string | number } | null | undefined

/**
 * Ids of the offerings the viewer is actively enrolled in: `status = active`
 * and `accessExpiresAt` in the future (PRD §5.2, §10). Cached on the request so
 * field access on every session row costs one query.
 */
export async function activeOfferingIds(
  payload: Payload,
  user: MaybeUser,
  req?: Partial<PayloadRequest>,
): Promise<string[]> {
  if (!user) return []
  const cacheKey = `activeOfferingIds:${user.id}`
  const cached = req?.context?.[cacheKey] as Promise<string[]> | undefined
  if (cached) return cached

  const lookup = payload
    .find({
      collection: 'enrollments',
      where: {
        and: [
          { learner: { equals: user.id } },
          { status: { equals: 'active' } },
          { accessExpiresAt: { greater_than: new Date().toISOString() } },
        ],
      },
      select: { offering: true },
      pagination: false,
      depth: 0,
      overrideAccess: true,
      req,
    })
    .then(({ docs }) => docs.map((doc) => String(doc.offering)))
  if (req?.context) req.context[cacheKey] = lookup
  return lookup
}

/** True when the viewer is actively enrolled in this offering (sessions, class links). */
export async function hasOfferingAccess(
  payload: Payload,
  user: MaybeUser,
  offeringId: string,
  req?: Partial<PayloadRequest>,
): Promise<boolean> {
  return (await activeOfferingIds(payload, user, req)).includes(String(offeringId))
}
