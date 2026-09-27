import { test, expect, type Page } from '@playwright/test'
import { e2eCourses, e2eOfferings, e2eOtherSessions, e2eSessions, e2eUsers } from '../payload/seed/e2e.ts'
import { logInAs } from './helpers/auth.ts'
import { fixtureIds } from './helpers/fixtures.ts'

const coursePath = `/courses/${e2eCourses.published.slug}`
const main = (page: Page) => page.getByRole('main')
const sessionRow = (page: Page, title: string) =>
  main(page).getByRole('region', { name: 'Your sessions' }).getByRole('listitem').filter({ hasText: title })
const otherLinks = [e2eOtherSessions.notYetOpen.classLink, e2eOtherSessions.unlisted.classLink]

test.describe('Sessions for an enrolled learner', () => {
  test('show the schedule with the class link only inside its window, instead of buy buttons', async ({ page }) => {
    await logInAs(page, e2eUsers.sessionLearner.email, coursePath, e2eCourses.published.title)
    await expect(page.getByRole('heading', { name: 'Your sessions' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Join a cohort' })).toHaveCount(0)
    await expect(main(page).getByRole('button', { name: 'Buy a seat' })).toHaveCount(0)

    // Starts in 1 hour: inside the 24-hour window.
    const soon = sessionRow(page, e2eSessions.soon.title)
    await expect(soon.getByRole('link', { name: /Join class/ })).toHaveAttribute('href', e2eSessions.soon.classLink)
    // Shown in the session's time zone.
    await expect(soon).toContainText(/E[SD]T/)

    // Three days out: date only.
    const later = sessionRow(page, e2eSessions.later.title)
    await expect(later).toContainText('Class link opens 24 hours before')
    await expect(later.getByRole('link')).toHaveCount(0)

    // Two days ago.
    await expect(sessionRow(page, e2eSessions.ended.title)).toContainText('Ended')

    const html = await page.content()
    expect(html).not.toContain(e2eSessions.later.classLink)
    expect(html).not.toContain(e2eSessions.ended.classLink)
    // Links of other offerings of the same course never reach this learner.
    for (const link of otherLinks) expect(html).not.toContain(link)
  })
})

test.describe('Class links stay private', () => {
  test('anonymous visitors see first-session dates but no class links', async ({ page }) => {
    await page.goto(coursePath)
    const open = main(page).getByRole('region', { name: e2eOfferings.onSale.title })
    await expect(open).toContainText('3 live sessions, starting')
    const html = await page.content()
    for (const link of [...Object.values(e2eSessions).map((s) => s.classLink), ...otherLinks]) {
      expect(html).not.toContain(link)
    }
  })

  test('the Unlisted offering page never includes its class link', async ({ page }) => {
    await page.goto(`${coursePath}?offering=${fixtureIds().offerings.unlisted}`)
    await expect(main(page).getByRole('region', { name: e2eOfferings.unlisted.title })).toContainText('Live session')
    expect(await page.content()).not.toContain(e2eOtherSessions.unlisted.classLink)
  })

  test('the public API never returns class links', async ({ request }) => {
    const rest = await request.get('/api/offerings?limit=100&depth=0')
    const body = await rest.text()
    expect(body).toContain(e2eSessions.soon.title)
    expect(body).not.toContain('classLink')

    const gql = await request.post('/api/graphql', {
      data: { query: '{ Offerings(limit: 100) { docs { title sessions { title classLink } } } }' },
    })
    const gqlBody = await gql.text()
    expect(gqlBody).not.toContain('meet.example.com')
  })
})
