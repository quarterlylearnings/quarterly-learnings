import { test, expect, type Page } from '@playwright/test'
import { e2eCourses, e2eCover } from '../payload/seed/e2e.ts'

const main = (page: Page) => page.getByRole('main')

test.describe('Course cover images', () => {
  test('show on /courses with their alt text, and courses without one render no image', async ({ page }) => {
    await page.goto('/courses')

    const covered = main(page).getByRole('link', { name: new RegExp(e2eCourses.published.title) })
    const cover = covered.getByRole('img', { name: e2eCover.alt })
    await expect(cover).toBeVisible()
    // Loaded, not broken.
    expect(await cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)

    const uncovered = main(page).getByRole('link', { name: new RegExp(e2eCourses.noCover.title) })
    await expect(uncovered).toBeVisible()
    await expect(uncovered.locator('img')).toHaveCount(0)
  })

  test('show on the course page, loaded directly rather than through the image optimizer', async ({ page }) => {
    await page.goto(`/courses/${e2eCourses.published.slug}`)
    const cover = main(page).getByRole('img', { name: e2eCover.alt })
    await expect(cover).toBeVisible()
    const src = await cover.getAttribute('src')
    expect(src).not.toContain('/_next/image')
    expect(await cover.evaluate((img: HTMLImageElement) => img.naturalWidth > 0)).toBe(true)

    await page.goto(`/courses/${e2eCourses.noCover.slug}`)
    await expect(page.getByRole('heading', { level: 1, name: e2eCourses.noCover.title })).toBeVisible()
    await expect(main(page).locator('img')).toHaveCount(0)
  })
})
