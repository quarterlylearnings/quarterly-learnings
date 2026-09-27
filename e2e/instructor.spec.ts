import { test, expect, type Page } from '@playwright/test'
import { E2E_PASSWORD, e2eCourses, e2eUsers } from '../payload/seed/e2e.ts'
import { fixtureIds } from './helpers/fixtures.ts'

const nav = (page: Page) => page.getByRole('complementary').getByRole('navigation')

// One flow, one login: parallel logins as one user can collide (see e2eUsers).
test('an instructor edits an assigned lesson in /admin and cannot open an unassigned course', async ({ page }) => {
  const ids = fixtureIds()

  await page.goto('/admin/login')
  await page.getByLabel(/email/i).fill(e2eUsers.instructor.email)
  await page.getByLabel(/password/i).fill(E2E_PASSWORD)
  await page.getByRole('button', { name: /log ?in/i }).click()
  await expect(page).toHaveURL(/\/admin\/?$/)

  // Content collections only; people and purchases stay with admins.
  for (const name of ['Courses', 'Lessons', 'Offerings', 'Media']) {
    await expect(nav(page).getByRole('link', { name, exact: true })).toBeVisible()
  }
  for (const name of ['Users', 'Enrollments', 'Quiz Attempts']) {
    await expect(nav(page).getByRole('link', { name, exact: true })).toHaveCount(0)
  }

  // Only the assigned course is listed.
  await page.goto('/admin/collections/courses')
  await expect(page.getByRole('link', { name: e2eCourses.published.title })).toBeVisible()
  await expect(page.getByText(e2eCourses.noCover.title)).toHaveCount(0)

  // Edit a (draft) lesson of the assigned course and save it.
  await page.goto(`/admin/collections/lessons/${ids.lessons.draft}`)
  const minutes = page.locator('#field-estimatedMinutes')
  await expect(minutes).toBeEditable()
  await minutes.fill('7')
  await page.getByRole('button', { name: /save draft/i }).click()
  await expect(page.getByText(/saved/i).first()).toBeVisible()
  await page.reload()
  await expect(page.locator('#field-estimatedMinutes')).toHaveValue('7')

  // An unassigned draft course can't be opened at all.
  await page.goto(`/admin/collections/courses/${ids.courses.draft}`)
  await expect(page.getByText(/could not be found|may not have access/i).first()).toBeVisible()
  await expect(page.locator('#field-title')).toHaveCount(0)

  // An unassigned published course is public anyway, but read-only here.
  await page.goto(`/admin/collections/courses/${ids.courses.noCover}`)
  await expect(page.locator('#field-title')).toBeDisabled()
})
