import { test, expect, type Page } from '@playwright/test'
import { e2eCourses, e2eLessons, e2eQuiz, e2eUsers } from '../payload/seed/e2e.ts'
import { logInAs } from './helpers/auth.ts'

const lessonPath = `/courses/${e2eCourses.published.slug}/${e2eLessons.preview.slug}`
const quiz = (page: Page) => page.getByRole('main').getByRole('region', { name: 'Quiz question' })
const option = (page: Page, index: number) => quiz(page).getByRole('radio', { name: e2eQuiz.options[index].text })
const wrong = 0
const right = e2eQuiz.correctIndex

test.describe('Quiz questions', () => {
  test('answers stay on the server until a pick is checked', async ({ page, request }) => {
    await page.goto(lessonPath)
    await expect(quiz(page).getByText(e2eQuiz.question)).toBeVisible()
    expect(await page.content()).not.toContain(e2eQuiz.explanation)

    const res = await request.get(`/api/lessons?where[slug][equals]=${e2eLessons.preview.slug}`)
    const body = JSON.stringify(await res.json())
    expect(body).toContain(e2eQuiz.question)
    expect(body).not.toContain('correctIndex')
    expect(body).not.toContain(e2eQuiz.explanation)
  })

  test('a logged-out preview reader is graded but nothing is saved', async ({ page }) => {
    await page.goto(lessonPath)
    await option(page, right).check()
    await quiz(page).getByRole('button', { name: 'Check answer' }).click()
    await expect(quiz(page).getByRole('status')).toContainText('Correct')

    await page.reload()
    await expect(quiz(page).getByRole('button', { name: 'Check answer' })).toBeDisabled()
    await expect(quiz(page).getByRole('status')).toBeEmpty()
  })

  test('wrong → Not quite → try again → correct → reload shows the latest attempt', async ({ page }) => {
    await logInAs(page, e2eUsers.quizTaker.email, lessonPath, e2eLessons.preview.title)
    const check = quiz(page).getByRole('button', { name: 'Check answer' })
    await expect(check).toBeDisabled()

    await option(page, wrong).check()
    await check.click()
    await expect(quiz(page).getByRole('status')).toContainText('Not quite')
    await expect(quiz(page).getByRole('status')).toContainText(e2eQuiz.explanation)
    await expect(quiz(page).getByText('Your answer')).toBeVisible()
    await expect(quiz(page).getByText('Correct answer')).toBeVisible()

    await quiz(page).getByRole('button', { name: 'Try again' }).click()
    await expect(check).toBeDisabled()
    await option(page, right).check()
    await check.click()
    await expect(quiz(page).getByRole('status')).toContainText('Correct')
    await expect(quiz(page).getByText('Your answer')).toHaveCount(0)

    await page.reload()
    await expect(quiz(page).getByRole('status')).toContainText('Correct')
    await expect(option(page, right)).toBeChecked()
    await expect(quiz(page).getByRole('button', { name: 'Try again' })).toBeVisible()
  })
})
