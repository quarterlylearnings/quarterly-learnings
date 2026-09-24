import { test, expect } from '@playwright/test'

// PRD §4.7: the global primary is QL Learn yellow, but the marketing site keeps
// its blue via .theme-site on <body>. Guard against the site turning yellow.
test('marketing pages keep the blue primary', async ({ page }) => {
  await page.goto('/about')
  const primary = await page.evaluate(() =>
    getComputedStyle(document.body).getPropertyValue('--color-primary').trim().toLowerCase(),
  )
  expect(primary).toBe('#80a1d4')
})
