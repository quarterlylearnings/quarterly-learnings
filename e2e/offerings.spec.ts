import { test, expect, type Page } from '@playwright/test'
import { e2eCourses, e2eOfferings, e2eOtherCourseOffering } from '../payload/seed/e2e.ts'
import { fixtureIds } from './helpers/fixtures.ts'

const coursePath = `/courses/${e2eCourses.published.slug}`
const main = (page: Page) => page.getByRole('main')
const card = (page: Page, title: string) => main(page).getByRole('region', { name: title })

test.describe('Offerings on the course page', () => {
  test('lists On sale offerings with price and sales dates, soonest first', async ({ page }) => {
    await page.goto(coursePath)
    await expect(page.getByRole('heading', { name: 'Join a cohort' })).toBeVisible()

    const open = card(page, e2eOfferings.onSale.title)
    await expect(open).toContainText('$499')
    await expect(open).toContainText('Team seats $399 each')
    await expect(open).toContainText('Sales close')
    await expect(open.getByRole('button', { name: 'Buy a seat' })).toBeDisabled()
    await expect(open.getByRole('button', { name: 'Buy for a team' })).toBeDisabled()

    // Ordered by when sales open: ended (-60d), open (-7d), upcoming (+14d).
    const titles = await main(page).locator('section[aria-labelledby^="offering-"] h3').allTextContents()
    expect(titles).toEqual([e2eOfferings.salesEnded.title, e2eOfferings.onSale.title, e2eOfferings.notYetOpen.title])
  })

  test('explains offerings outside their sales window and disables buying', async ({ page }) => {
    await page.goto(coursePath)

    const upcoming = card(page, e2eOfferings.notYetOpen.title)
    await expect(upcoming).toContainText(/Sales open \w+ \d{1,2}, \d{4}\./)
    await expect(upcoming.getByRole('button', { name: 'Buy a seat' })).toBeDisabled()
    // No seat price, so no team button.
    await expect(upcoming.getByRole('button', { name: 'Buy for a team' })).toHaveCount(0)

    const ended = card(page, e2eOfferings.salesEnded.title)
    await expect(ended).toContainText(/Sales closed \w+ \d{1,2}, \d{4}\./)
    await expect(ended.getByRole('button', { name: 'Buy a seat' })).toBeDisabled()
  })

  test('never shows Draft or Closed offerings, and hides Unlisted without its link', async ({ page }) => {
    await page.goto(coursePath)
    for (const hidden of [e2eOfferings.draft, e2eOfferings.closed, e2eOfferings.unlisted]) {
      await expect(main(page)).not.toContainText(hidden.title)
    }
  })

  test('?offering= reveals that Unlisted offering', async ({ page }) => {
    await page.goto(`${coursePath}?offering=${fixtureIds().offerings.unlisted}`)
    const unlisted = card(page, e2eOfferings.unlisted.title)
    await expect(unlisted).toContainText('Private link')
    await expect(unlisted).toContainText('$399')
  })

  test('?offering= ignores Draft, Closed, other-course and malformed ids', async ({ page }) => {
    const { offerings } = fixtureIds()
    for (const id of [offerings.draft, offerings.closed, offerings.otherCourse, 'not-an-id']) {
      await page.goto(`${coursePath}?offering=${id}`)
      await expect(card(page, e2eOfferings.onSale.title)).toBeVisible()
      for (const hidden of [e2eOfferings.draft, e2eOfferings.closed, e2eOtherCourseOffering]) {
        await expect(main(page)).not.toContainText(hidden.title)
      }
    }
  })
})

test.describe('Offerings API', () => {
  test('returns only On sale offerings to the public', async ({ request }) => {
    const res = await request.get('/api/offerings?limit=100')
    const { docs } = await res.json()
    expect(docs.length).toBeGreaterThan(0)
    expect(new Set(docs.map((doc: { salesState: string }) => doc.salesState))).toEqual(new Set(['on_sale']))
  })

  test('does not return an Unlisted offering by id over REST or GraphQL', async ({ request }) => {
    const id = fixtureIds().offerings.unlisted
    expect((await request.get(`/api/offerings/${id}`)).ok()).toBe(false)

    const gql = await request.post('/api/graphql', {
      data: { query: `{ Offering(id: "${id}") { title } }` },
    })
    const body = await gql.json()
    expect(body.data?.Offering ?? null).toBeNull()
  })
})
