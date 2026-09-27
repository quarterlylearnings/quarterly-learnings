import type { Payload } from 'payload'

/**
 * Resolves once Mongoose has created every collection and built its indexes.
 * On a fresh database that happens in the background, and a transactional
 * write that lands first fails ("namespace already in use", lock timeouts).
 * Seeds and tests call this before their first write.
 */
export async function waitForIndexes(payload: Payload) {
  const models = [...Object.values(payload.db.collections), ...Object.values(payload.db.versions ?? {})]
  await Promise.all(models.map((model) => model.init()))
}
