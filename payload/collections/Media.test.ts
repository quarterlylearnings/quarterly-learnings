import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Media, User } from '../../payload-types.ts'
import { createUser } from '../../test/factories.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'
import { placeholderImage } from '../utilities/placeholderImage.ts'

describe('Media', () => {
  let payload: Payload
  let learner: User

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    // The first user in an empty database becomes an admin, so create one first.
    await createUser(payload, 'admin')
    learner = await createUser(payload)
  })

  const upload = async (data: Partial<Media>, user?: User) =>
    payload.create({
      collection: 'media',
      data: data as Media,
      file: await placeholderImage('cover.png'),
      ...(user ? { user, overrideAccess: false } : {}),
    })

  it('requires alt text', async () => {
    await expect(upload({})).rejects.toThrow(/alt/i)
  })

  it('stores an image with a card size, without R2 credentials', async () => {
    const media = await upload({ alt: 'A yellow cover' })
    expect(media.alt).toBe('A yellow cover')
    expect(media.mimeType).toBe('image/png')
    expect(media.sizes?.card?.width).toBe(800)
    // Tests run with MEDIA_STORAGE=local, so the file is served by Payload.
    expect(media.url).toMatch(/\/api\/media\/file\/cover(-\d+)?\.png$/)
  })

  it('is readable by anyone, uploadable only by admins', async () => {
    const media = await upload({ alt: 'Public cover' })
    const read = await payload.findByID({ collection: 'media', id: media.id, overrideAccess: false })
    expect(read.alt).toBe('Public cover')
    expect(learner.role).toBe('learner')
    await expect(upload({ alt: 'Sneaky' }, learner)).rejects.toThrow()
  })

  it('attaches to a course as its cover', async () => {
    const media = await upload({ alt: 'Course cover' })
    const course = await payload.create({
      collection: 'courses',
      data: {
        title: 'Covered',
        slug: '',
        description: 'A course.',
        level: 'beginner',
        coverImage: media.id,
        _status: 'published',
      },
    })
    const read = await payload.findByID({ collection: 'courses', id: course.id, depth: 1, overrideAccess: false })
    expect((read.coverImage as Media).alt).toBe('Course cover')
  })
})
