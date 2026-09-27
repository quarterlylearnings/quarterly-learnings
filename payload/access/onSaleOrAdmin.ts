import type { Access, Where } from 'payload'
import { activeOfferingIds } from './hasOfferingAccess.ts'
import { userIsAdmin } from './isAdmin.ts'

/**
 * Offerings read access (PRD §5.3): the public sees On sale offerings; an
 * enrolled learner also sees their own offering in any state (R2). Unlisted
 * ones are never readable through the API otherwise; the course page loads
 * one by exact id on the server. `sessions[].classLink` has its own field access.
 */
export const onSaleOrAdmin: Access = async ({ req }) => {
  if (userIsAdmin(req.user)) return true
  const onSale: Where = { salesState: { equals: 'on_sale' } }
  const enrolledIn = await activeOfferingIds(req.payload, req.user, req)
  return enrolledIn.length === 0 ? onSale : { or: [onSale, { id: { in: enrolledIn } }] }
}
