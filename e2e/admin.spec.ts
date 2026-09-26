import { test, expect, type Page } from '@playwright/test'
import { E2E_PASSWORD, e2eUsers } from '../payload/seed/e2e.ts'

async function adminLogIn(page: Page) {
  await page.goto('/admin/login')
  await page.getByLabel(/email/i).fill(e2eUsers.admin.email)
  await page.getByLabel(/password/i).fill(E2E_PASSWORD)
  await page.getByRole('button', { name: /log ?in/i }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)
}

test.describe('Payload admin (/admin)', () => {
  // Two of these log in as the seeded admin, and parallel logins as one user
  // can drop a session (see e2eUsers), so they run in order in one worker.
  test.describe.configure({ mode: 'default' })

  test('seeded admin can log in and sees QL branding', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/email/i).fill(e2eUsers.admin.email)
    await page.getByLabel(/password/i).fill(E2E_PASSWORD)
    await page.getByRole('button', { name: /log ?in/i }).click()

    await expect(page).toHaveURL(/\/admin\/?$/)
    await expect(page).toHaveTitle(/QL Ledger Admin/)
    await expect(page.getByRole('link', { name: /users/i }).first()).toBeVisible()
  })

  test('learner cannot use the admin panel', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel(/email/i).fill(e2eUsers.panelProbe.email)
    await page.getByLabel(/password/i).fill(E2E_PASSWORD)
    await page.getByRole('button', { name: /log ?in/i }).click()

    await expect(page.getByText(/unauthorized|not allowed|you are not allowed/i).first()).toBeVisible()
  })

  test('lesson editor opens with rich text, course, order and preview fields', async ({ page }) => {
    await adminLogIn(page)
    await page.goto('/admin/collections/lessons/create')

    await expect(page.getByLabel(/title/i).first()).toBeVisible()
    // Lexical needs its client components in the import map to render.
    await expect(page.locator('[contenteditable="true"]').first()).toBeVisible()
    for (const field of ['course', 'order', 'estimatedMinutes', 'preview']) {
      await expect(page.locator(`#field-${field}`)).toBeVisible()
    }

    // Lesson blocks are offered in the editor's slash menu.
    await page.locator('[contenteditable="true"]').first().click()
    await page.keyboard.type('/code')
    await expect(page.getByText('Code Example', { exact: true }).first()).toBeVisible()
  })

  test('enrollment form offers learner, offering, source, status and access date', async ({ page }) => {
    await adminLogIn(page)
    await page.goto('/admin/collections/enrollments/create')
    for (const field of ['learner', 'offering', 'course', 'source', 'status', 'accessExpiresAt']) {
      await expect(page.locator(`#field-${field}`)).toBeVisible()
    }
  })

  test('course form has a cover image upload', async ({ page }) => {
    await adminLogIn(page)
    await page.goto('/admin/collections/courses/create')
    await expect(page.locator('#field-coverImage')).toBeVisible()
  })
})
