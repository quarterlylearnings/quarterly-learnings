import { getPayload, type Payload } from 'payload'
import config from '../payload.config.ts'
import { waitForIndexes } from '../payload/utilities/waitForIndexes.ts'

let ready: Promise<Payload> | undefined

/** Payload Local API bound to the in-memory test database, with indexes built. */
export function getTestPayload(): Promise<Payload> {
  ready ??= getPayload({ config }).then(async (payload) => {
    await waitForIndexes(payload)
    return payload
  })
  return ready
}

/**
 * Empties every collection, including the versions collections behind drafts,
 * so each test starts from a clean database.
 */
export async function resetDb(payload: Payload) {
  const models = [...Object.values(payload.db.collections), ...Object.values(payload.db.versions ?? {})]
  await Promise.all(models.map((model) => model.deleteMany({})))
}
