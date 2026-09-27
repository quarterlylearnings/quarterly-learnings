import { test, expect } from '@playwright/test'
import { e2eCodeBlock, e2eCourses, e2eLessons } from '../payload/seed/e2e.ts'

test.describe('Code Example blocks', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] })

  test('render with a language label and caption, and copy the code', async ({ page }) => {
    await page.goto(`/courses/${e2eCourses.published.slug}/${e2eLessons.preview.slug}`)
    const figure = page.getByRole('main').getByRole('figure')

    await expect(figure.getByText('JavaScript', { exact: true })).toBeVisible()
    await expect(figure.locator('pre code')).toHaveText(e2eCodeBlock.code)
    await expect(figure.getByText(e2eCodeBlock.caption)).toBeVisible()

    // Keyboard: focus the button and press Enter.
    const copy = figure.getByRole('button', { name: 'Copy JavaScript code' })
    await copy.focus()
    await page.keyboard.press('Enter')

    await expect(figure.getByRole('button', { name: 'Copied' })).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(e2eCodeBlock.code)
    // Returns to "Copy" after 2 seconds.
    await expect(figure.getByRole('button', { name: 'Copy JavaScript code' })).toBeVisible({ timeout: 4000 })
  })
})
