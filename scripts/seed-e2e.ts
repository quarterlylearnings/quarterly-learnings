// Run with `payload run scripts/seed-e2e.ts` (scripts/test-server.ts does this).
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { seedE2E } from '../payload/seed/e2e.ts'
import { waitForIndexes } from '../payload/utilities/waitForIndexes.ts'

const payload = await getPayload({ config })
await waitForIndexes(payload)
await seedE2E(payload)
payload.logger.info('Seeded e2e fixtures')
process.exit(0)
