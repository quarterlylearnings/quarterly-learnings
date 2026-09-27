import { test, expect } from '@playwright/test'

test('unknown URL renders the site 404 with navigation', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: /in the curriculum/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /back to home/i })).toHaveAttribute('href', '/')
  await expect(page.getByRole('navigation').first()).toBeVisible()
})
