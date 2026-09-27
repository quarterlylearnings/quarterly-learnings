// Run with `payload run scripts/seed-e2e.ts` (scripts/test-server.ts does this).
import { writeFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../payload.config.ts'
import { seedE2E } from '../payload/seed/e2e.ts'
import { waitForIndexes } from '../payload/utilities/waitForIndexes.ts'

const payload = await getPayload({ config })
await waitForIndexes(payload)
const ids = await seedE2E(payload)
// Playwright passes E2E_FIXTURES_FILE so specs can find ids the public API hides.
if (process.env.E2E_FIXTURES_FILE) writeFileSync(process.env.E2E_FIXTURES_FILE, JSON.stringify(ids))
payload.logger.info('Seeded e2e fixtures')
process.exit(0)
