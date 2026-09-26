import { test, expect, type Page } from '@playwright/test'
import { e2eCourses, e2eLessons } from '../payload/seed/e2e.ts'

const coursePath = `/courses/${e2eCourses.published.slug}`
const main = (page: Page) => page.getByRole('main')

test.describe('Course page (/courses/[slug])', () => {
  test('shows the description, level and ordered outline with previews marked', async ({ page }) => {
    await page.goto(coursePath)

    await expect(page.getByRole('heading', { level: 1, name: e2eCourses.published.title })).toBeVisible()
    await expect(main(page).getByText(e2eCourses.published.description)).toBeVisible()
    await expect(main(page).getByText(e2eCourses.published.level, { exact: true })).toBeVisible()

    const items = main(page).getByRole('listitem')
    await expect(items).toHaveCount(2)
    await expect(items.nth(0)).toContainText(e2eLessons.preview.title)
    await expect(items.nth(0)).toContainText('Free preview')
    await expect(items.nth(1)).toContainText(e2eLessons.locked.title)
    await expect(items.nth(1)).not.toContainText('Free preview')
    await expect(main(page)).not.toContainText(e2eLessons.draft.title)
  })

  test('returns 404 for draft and unknown courses', async ({ page }) => {
    for (const slug of [e2eCourses.draft.slug, 'no-such-course']) {
      const response = await page.goto(`/courses/${slug}`)
      expect(response?.status()).toBe(404)
      await expect(page.getByRole('heading', { name: 'We couldn’t find that page' })).toBeVisible()
    }
  })
})

test.describe('Lesson page (/courses/[slug]/[lesson])', () => {
  test('an anonymous visitor reads a preview lesson', async ({ page }) => {
    await page.goto(coursePath)
    await main(page).getByRole('link', { name: new RegExp(e2eLessons.preview.title) }).click()

    await expect(page.getByRole('heading', { level: 1, name: e2eLessons.preview.title })).toBeVisible()
    await expect(main(page).getByText(e2eLessons.preview.body)).toBeVisible()
    await expect(main(page).getByRole('link', { name: 'Enroll to read' })).toHaveCount(0)
  })

  test('an anonymous visitor sees the locked state on a non-preview lesson', async ({ page }) => {
    const response = await page.goto(`${coursePath}/${e2eLessons.locked.slug}`)
    expect(response?.status()).toBe(200)

    await expect(page.getByRole('heading', { level: 1, name: e2eLessons.locked.title })).toBeVisible()
    await expect(main(page).getByRole('link', { name: 'Enroll to read' })).toHaveAttribute('href', coursePath)
    // The content must not reach the browser at all, not just be hidden.
    expect(await page.content()).not.toContain(e2eLessons.locked.body)
  })

  test('draft lessons 404 on a direct URL', async ({ page }) => {
    const response = await page.goto(`${coursePath}/${e2eLessons.draft.slug}`)
    expect(response?.status()).toBe(404)
  })

  test('locked lesson content is not readable through the public API', async ({ request }) => {
    const res = await request.get(`/api/lessons?where[slug][equals]=${e2eLessons.locked.slug}`)
    expect(res.ok()).toBe(true)
    const { docs } = await res.json()
    expect(docs).toHaveLength(1)
    expect(docs[0].title).toBe(e2eLessons.locked.title)
    expect(docs[0].content).toBeUndefined()
  })
})
