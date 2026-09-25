import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

/**
 * Local API access for (ledger) pages. Every learner-facing read must pass
 * `{ user, overrideAccess: false }` — the Local API skips access control by
 * default (PRD §4.5).
 */
export async function getViewer() {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  return { payload, user }
}
