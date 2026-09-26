import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Course, Offering, User } from '../../payload-types.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'
import type { SalesState } from '../utilities/offerings.ts'

describe('Offerings', () => {
  let payload: Payload
  let admin: User
  let learner: User
  let course: Course

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
    course = await payload.create({
      collection: 'courses',
      data: { title: 'Course', slug: '', description: 'A course.', level: 'beginner', _status: 'published' },
    })
  })

  type OfferingOverrides = Partial<Pick<Offering, 'price' | 'seatPrice' | 'salesOpenAt' | 'salesCloseAt'>>

  const createOffering = (salesState: SalesState, data: OfferingOverrides = {}) =>
    payload.create({
      collection: 'offerings',
      data: { course: course.id, title: salesState, salesState, price: 49900, currency: 'usd', ...data },
    })

  /** Payload's ValidationError keeps the per-field message in `data.errors`. */
  const fieldError = (path: string, message: RegExp) =>
    expect.objectContaining({
      data: expect.objectContaining({
        errors: expect.arrayContaining([expect.objectContaining({ path, message: expect.stringMatching(message) })]),
      }),
    })

  describe('read access', () => {
    beforeEach(async () => {
      for (const state of ['draft', 'unlisted', 'on_sale', 'closed'] as const) await createOffering(state)
    })

    const statesFor = async (user?: User) => {
      const { docs } = await payload.find({ collection: 'offerings', user, overrideAccess: false, sort: 'title' })
      return docs.map((offering) => offering.salesState)
    }

    it('shows anonymous visitors and learners only On sale offerings', async () => {
      expect(await statesFor(undefined)).toEqual(['on_sale'])
      expect(await statesFor(learner)).toEqual(['on_sale'])
    })

    it('shows admins every state', async () => {
      expect(await statesFor(admin)).toEqual(['closed', 'draft', 'on_sale', 'unlisted'])
    })

    it('does not reveal an Unlisted offering by exact id', async () => {
      const { docs } = await payload.find({ collection: 'offerings', where: { salesState: { equals: 'unlisted' } } })
      await expect(
        payload.findByID({ collection: 'offerings', id: docs[0].id, overrideAccess: false }),
      ).rejects.toThrow()
    })
  })

  describe('validation', () => {
    it('allows a Draft without a price', async () => {
      const draft = await createOffering('draft', { price: null })
      expect(draft.price).toBeNull()
    })

    it.each(['unlisted', 'on_sale', 'closed'] as const)('requires a price when %s', async (state) => {
      await expect(createOffering(state, { price: null })).rejects.toEqual(fieldError('price', /Set a price/))
    })

    it('requires a price when a Draft moves on', async () => {
      const draft = await createOffering('draft', { price: null })
      await expect(
        payload.update({ collection: 'offerings', id: draft.id, data: { salesState: 'on_sale' } }),
      ).rejects.toEqual(fieldError('price', /Set a price/))
    })

    it('rejects fractional or negative cents', async () => {
      await expect(createOffering('on_sale', { price: 49.5 })).rejects.toEqual(fieldError('price', /whole cents/))
      await expect(createOffering('on_sale', { seatPrice: -1 })).rejects.toEqual(fieldError('seatPrice', /whole cents/))
    })

    it('rejects a sales window that closes before it opens', async () => {
      await expect(
        createOffering('on_sale', { salesOpenAt: '2026-10-10T00:00:00Z', salesCloseAt: '2026-10-01T00:00:00Z' }),
      ).rejects.toEqual(fieldError('salesCloseAt', /close after/))
    })

    it('defaults currency to usd and leaves seat price empty', async () => {
      const offering = await payload.create({
        collection: 'offerings',
        data: { course: course.id, title: 'Defaults', salesState: 'on_sale', price: 100 } as Offering,
      })
      expect(offering.currency).toBe('usd')
      expect(offering.seatPrice ?? null).toBeNull()
    })
  })

  it('does not let learners create offerings', async () => {
    await expect(
      payload.create({
        collection: 'offerings',
        data: { course: course.id, title: 'Sneaky', salesState: 'on_sale', price: 1, currency: 'usd' },
        user: learner,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})
