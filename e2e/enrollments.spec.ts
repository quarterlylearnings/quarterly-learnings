import { test, expect, type Page } from '@playwright/test'
import { e2eCourses, e2eLessons, e2eUsers } from '../payload/seed/e2e.ts'
import { logInAs } from './helpers/auth.ts'

const coursePath = `/courses/${e2eCourses.published.slug}`
const lessonPath = (lesson: { slug: string }) => `${coursePath}/${lesson.slug}`
const main = (page: Page) => page.getByRole('main')
const lessonNav = (page: Page) => main(page).getByRole('navigation', { name: 'Lessons' })
const lessonHeading = (page: Page, lesson: { title: string }) =>
  page.getByRole('heading', { level: 1, name: lesson.title })

test.describe('Enrolled learners', () => {
  test('read non-preview lessons and move between them with prev/next', async ({ page }) => {
    await logInAs(page, e2eUsers.enrolled.email, lessonPath(e2eLessons.locked), e2eLessons.locked.title)
    await expect(main(page).getByText(e2eLessons.locked.body)).toBeVisible()
    await expect(main(page).getByRole('link', { name: 'Enroll to read' })).toHaveCount(0)

    await lessonNav(page).getByRole('link', { name: /Next/ }).click()
    await expect(lessonHeading(page, e2eLessons.rollout)).toBeVisible()
    await expect(main(page).getByText(e2eLessons.rollout.body)).toBeVisible()
    // Last published lesson: no Next, and the draft lesson is skipped.
    await expect(lessonNav(page).getByRole('link', { name: /Next/ })).toHaveCount(0)

    await lessonNav(page).getByRole('link', { name: /Previous/ }).click()
    await expect(lessonHeading(page, e2eLessons.locked)).toBeVisible()
    await lessonNav(page).getByRole('link', { name: /Previous/ }).click()
    await expect(lessonHeading(page, e2eLessons.preview)).toBeVisible()
    await expect(lessonNav(page).getByRole('link', { name: /Previous/ })).toHaveCount(0)
  })
})

test.describe('Locked lessons', () => {
  test('an expired enrollment shows when access ended', async ({ page }) => {
    await logInAs(page, e2eUsers.expired.email, lessonPath(e2eLessons.locked), e2eLessons.locked.title)
    await expect(main(page)).toContainText(/Your access ended on \w+ \d{1,2}, \d{4}\./)
    expect(await page.content()).not.toContain(e2eLessons.locked.body)
    await expect(main(page).getByRole('link', { name: 'Enroll to read' })).toHaveCount(0)
  })

  test('a logged-in learner without an enrollment is told how to get access', async ({ page }) => {
    await logInAs(page, e2eUsers.unenrolled.email, lessonPath(e2eLessons.locked), e2eLessons.locked.title)
    await expect(main(page).getByRole('link', { name: 'Enroll to read' })).toHaveAttribute('href', coursePath)
    await expect(main(page).getByRole('link', { name: 'Log in' })).toHaveCount(0)
    expect(await page.content()).not.toContain(e2eLessons.locked.body)
  })

  test('a logged-out visitor gets a login link back to the lesson', async ({ page }) => {
    await page.goto(lessonPath(e2eLessons.locked))
    await expect(main(page).getByRole('link', { name: 'Log in' })).toHaveAttribute(
      'href',
      `/login?next=${encodeURIComponent(lessonPath(e2eLessons.locked))}`,
    )
    // Prev/next still works on locked lessons.
    await expect(lessonNav(page).getByRole('link', { name: /Previous/ })).toHaveAttribute(
      'href',
      lessonPath(e2eLessons.preview),
    )
  })
})
