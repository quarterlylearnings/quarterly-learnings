import { test, expect } from '@playwright/test'
import { e2eCourses } from '../payload/seed/e2e.ts'

test.describe('Course catalog (/courses)', () => {
  test('lists published courses and hides drafts', async ({ page }) => {
    await page.goto('/courses')

    await expect(page.getByRole('heading', { level: 1, name: 'Courses' })).toBeVisible()
    const card = page.getByRole('link', { name: new RegExp(e2eCourses.published.title) })
    await expect(card).toHaveAttribute('href', `/courses/${e2eCourses.published.slug}`)
    await expect(card.getByText(e2eCourses.published.level, { exact: false })).toBeVisible()
    await expect(page.getByText(e2eCourses.draft.title)).toHaveCount(0)
  })

  test('shows no prices', async ({ page }) => {
    await page.goto('/courses')
    await expect(page.locator('main')).not.toContainText('$')
  })

  test('draft courses are not readable through the public API', async ({ request }) => {
    const res = await request.get(`/api/courses?where[slug][equals]=${e2eCourses.draft.slug}`)
    expect(res.ok()).toBe(true)
    const body = await res.json()
    expect(body.docs).toHaveLength(0)
  })

  test('uses the QL Learn yellow primary', async ({ page }) => {
    await page.goto('/courses')
    const primary = await page.evaluate(() =>
      getComputedStyle(document.body).getPropertyValue('--color-primary').trim().toLowerCase(),
    )
    expect(primary).toBe('#ffdb00')
  })
})
