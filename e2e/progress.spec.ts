import { test, expect, type Page } from '@playwright/test'
import { e2eCourses, e2eLessons, e2eUsers } from '../payload/seed/e2e.ts'
import { logInAs } from './helpers/auth.ts'

const coursePath = `/courses/${e2eCourses.published.slug}`
const lessonPath = (lesson: { slug: string }) => `${coursePath}/${lesson.slug}`
const main = (page: Page) => page.getByRole('main')
const markComplete = (page: Page) => main(page).getByRole('button', { name: 'Mark complete' })
const TOTAL = 3 // published lessons of the course

test.describe('Mark complete', () => {
  test('is hidden from logged-out visitors, even on a preview lesson', async ({ page }) => {
    await page.goto(lessonPath(e2eLessons.preview))
    await expect(main(page).getByText(e2eLessons.preview.body)).toBeVisible()
    await expect(markComplete(page)).toHaveCount(0)
  })

  test('is hidden from a logged-in learner reading a preview they are not enrolled for', async ({ page }) => {
    await logInAs(page, e2eUsers.previewReader.email, lessonPath(e2eLessons.preview), e2eLessons.preview.title)
    await expect(main(page).getByText(e2eLessons.preview.body)).toBeVisible()
    await expect(markComplete(page)).toHaveCount(0)
  })

  test('/progress asks logged-out visitors to log in', async ({ page }) => {
    await page.goto('/progress')
    await expect(page).toHaveURL(/\/login\?next=(%2F|\/)progress$/)
  })
})

test('complete two lessons, see 2/N on /progress, and keep it after logging in again', async ({ page }) => {
  const { email } = e2eUsers.progressLearner
  await logInAs(page, email, lessonPath(e2eLessons.preview), e2eLessons.preview.title)

  await markComplete(page).click()
  await expect(main(page).getByRole('status').filter({ hasText: 'Completed' })).toBeVisible()

  await page.goto(lessonPath(e2eLessons.locked))
  await markComplete(page).click()
  await expect(main(page).getByRole('status').filter({ hasText: 'Completed' })).toBeVisible()

  // Already-completed lessons render "Completed" on load.
  await page.goto(lessonPath(e2eLessons.preview))
  await expect(main(page).getByText('Completed')).toBeVisible()
  await expect(markComplete(page)).toHaveCount(0)

  await page.getByRole('banner').getByRole('link', { name: 'Progress' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Progress' })).toBeVisible()
  const row = main(page).getByRole('listitem').filter({ hasText: e2eCourses.published.title })
  await expect(row).toContainText(`2 of ${TOTAL} lessons complete`)
  await expect(row.getByRole('link', { name: `Next: ${e2eLessons.rollout.title}` })).toHaveAttribute(
    'href',
    lessonPath(e2eLessons.rollout),
  )

  await page.getByRole('banner').getByRole('button', { name: 'Log out' }).click()
  await expect(page.getByRole('banner').getByRole('link', { name: 'Log in' })).toBeVisible()
  await logInAs(page, email, '/progress', 'Progress')
  await expect(main(page).getByRole('listitem').filter({ hasText: e2eCourses.published.title })).toContainText(
    `2 of ${TOTAL} lessons complete`,
  )
})
