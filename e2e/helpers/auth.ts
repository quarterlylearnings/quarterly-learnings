import { expect, type Page } from '@playwright/test'
import { E2E_PASSWORD } from '../../payload/seed/e2e.ts'

/**
 * Logs in through /login and waits for `next` to render. Use a seeded user no
 * other test logs in as (see e2eUsers).
 */
export async function logInAs(page: Page, email: string, next: string, landedHeading: string | RegExp) {
  await page.goto(`/login?next=${encodeURIComponent(next)}`)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(E2E_PASSWORD)
  await page.getByRole('button', { name: 'Log in' }).click()
  // Server-action redirects are client-side navigations: wait for the page, not just the URL.
  await expect(page.getByRole('heading', { level: 1, name: landedHeading })).toBeVisible()
}
