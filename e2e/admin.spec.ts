import { test, expect } from '@playwright/test'
import { E2E_PASSWORD, e2eUsers } from '../payload/seed/e2e.ts'

test.describe('Payload admin (/admin)', () => {
  test('seeded admin can log in and sees QL branding', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/email/i).fill(e2eUsers.admin.email)
    await page.getByLabel(/password/i).fill(E2E_PASSWORD)
    await page.getByRole('button', { name: /log ?in/i }).click()

    await expect(page).toHaveURL(/\/admin\/?$/)
    await expect(page).toHaveTitle(/QL Learn Admin/)
    await expect(page.getByRole('link', { name: /users/i }).first()).toBeVisible()
  })

  test('learner cannot use the admin panel', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/email/i).fill(e2eUsers.learner.email)
    await page.getByLabel(/password/i).fill(E2E_PASSWORD)
    await page.getByRole('button', { name: /log ?in/i }).click()

    await expect(page.getByText(/unauthorized|not allowed|you are not allowed/i).first()).toBeVisible()
  })
})
