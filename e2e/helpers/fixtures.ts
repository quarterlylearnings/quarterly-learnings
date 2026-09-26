import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { E2EFixtureIds } from '../../payload/seed/e2e.ts'

/** scripts/seed-e2e.ts writes seeded ids here (for docs the public API hides). */
export const E2E_FIXTURES_FILE = path.resolve('tmp/e2e-fixtures.json')

export function fixtureIds(): E2EFixtureIds {
  return JSON.parse(readFileSync(E2E_FIXTURES_FILE, 'utf8')) as E2EFixtureIds
}
