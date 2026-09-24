import type { Payload } from 'payload'

/**
 * Resolves once Mongoose has built every collection's indexes. On a fresh
 * database the builds run in the background, and a transactional write that
 * lands mid-build fails with a lock or WriteConflict error. Seeds and tests
 * call this before their first write.
 */
export async function waitForIndexes(payload: Payload) {
  await Promise.all(Object.values(payload.db.collections).map((model) => model.init()))
}
