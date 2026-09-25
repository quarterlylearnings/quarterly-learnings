import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { User } from '../../payload-types.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'

const base = { description: 'A course.', level: 'beginner' as const }

describe('Courses', () => {
  let payload: Payload
  let admin: User
  let learner: User

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    admin = await payload.create({
      collection: 'users',
      data: { email: 'admin@example.com', password: 'pw-123456', role: 'admin' },
    })
    learner = await payload.create({
      collection: 'users',
      data: { email: 'learner@example.com', password: 'pw-123456', role: 'learner' },
    })
    await payload.create({ collection: 'courses', data: { ...base, title: 'Published One', slug: '', _status: 'published' } })
    await payload.create({ collection: 'courses', data: { ...base, title: 'Draft One', slug: '', _status: 'draft' }, draft: true })
  })

  const titlesFor = async (user?: User) => {
    const { docs } = await payload.find({ collection: 'courses', user, overrideAccess: false, sort: 'title' })
    return docs.map((c) => c.title)
  }

  it('shows anonymous visitors and learners only published courses', async () => {
    expect(await titlesFor(undefined)).toEqual(['Published One'])
    expect(await titlesFor(learner)).toEqual(['Published One'])
  })

  it('shows admins drafts too', async () => {
    expect(await titlesFor(admin)).toEqual(['Draft One', 'Published One'])
  })

  it('generates a slug from the title when blank', async () => {
    const { docs } = await payload.find({ collection: 'courses', where: { title: { equals: 'Published One' } } })
    expect(docs[0].slug).toBe('published-one')
  })

  it('normalizes a hand-typed slug', async () => {
    const course = await payload.create({
      collection: 'courses',
      data: { ...base, title: 'Anything', slug: 'My Custom Slug!', _status: 'published' },
    })
    expect(course.slug).toBe('my-custom-slug')
  })

  it('rejects a duplicate slug', async () => {
    await expect(
      payload.create({ collection: 'courses', data: { ...base, title: 'Published One', slug: '', _status: 'published' } }),
    ).rejects.toThrow()
  })

  it('does not let learners create courses', async () => {
    await expect(
      payload.create({
        collection: 'courses',
        data: { ...base, title: 'Sneaky', slug: '', _status: 'published' },
        user: learner,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})
