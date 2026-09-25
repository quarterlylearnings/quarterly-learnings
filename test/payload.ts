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

/** Empties every collection so each test starts from a clean database. */
export async function resetDb(payload: Payload) {
  await Promise.all(
    Object.values(payload.db.collections).map((model) => model.deleteMany({})),
  )
}
