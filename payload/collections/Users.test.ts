import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { getTestPayload, resetDb } from '../../test/payload.ts'

const password = 'test-password-123'

describe('Users', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
  })

  it('makes the first user an admin so /admin is reachable', async () => {
    const first = await payload.create({
      collection: 'users',
      data: { email: 'first@example.com', password, role: 'learner' },
      overrideAccess: false,
    })
    expect(first.role).toBe('admin')
  })

  it('makes later public sign-ups learners, even if they ask for admin', async () => {
    await payload.create({ collection: 'users', data: { email: 'first@example.com', password, role: 'learner' } })
    const signup = await payload.create({
      collection: 'users',
      data: { email: 'second@example.com', password, role: 'admin' },
      overrideAccess: false,
    })
    expect(signup.role).toBe('learner')
  })

  it('lets an admin create another admin', async () => {
    const admin = await payload.create({ collection: 'users', data: { email: 'first@example.com', password, role: 'learner' } })
    const created = await payload.create({
      collection: 'users',
      data: { email: 'second@example.com', password, role: 'admin' },
      user: admin,
      overrideAccess: false,
    })
    expect(created.role).toBe('admin')
  })

  it('stops a learner from promoting themselves', async () => {
    await payload.create({ collection: 'users', data: { email: 'first@example.com', password, role: 'learner' } })
    const learner = await payload.create({ collection: 'users', data: { email: 'learner@example.com', password, role: 'learner' } })

    const updated = await payload.update({
      collection: 'users',
      id: learner.id,
      data: { role: 'admin', name: 'New Name' },
      user: learner,
      overrideAccess: false,
    })
    expect(updated.role).toBe('learner')
    expect(updated.name).toBe('New Name')
  })

  it('shows a learner only their own user record', async () => {
    await payload.create({ collection: 'users', data: { email: 'first@example.com', password, role: 'learner' } })
    const learner = await payload.create({ collection: 'users', data: { email: 'learner@example.com', password, role: 'learner' } })

    const result = await payload.find({ collection: 'users', user: learner, overrideAccess: false })
    expect(result.docs.map((u) => u.email)).toEqual(['learner@example.com'])
  })
})
