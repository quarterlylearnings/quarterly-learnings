import { test, expect, type Page } from '@playwright/test'
import { E2E_PASSWORD, e2eUsers } from '../payload/seed/e2e.ts'
import { latestEmailTo, linkIn } from './helpers/emails.ts'

const uniqueEmail = () => `learner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`
const header = (page: Page) => page.getByRole('banner')
const main = (page: Page) => page.getByRole('main')

// Auth actions redirect with a client-side navigation: the URL changes before
// the next page renders. Wait for the destination's heading before touching it.
// `exact` matters: "Account" would otherwise match "Create an account".
const landedOn = async (page: Page, heading: 'Account' | 'Courses') =>
  expect(page.getByRole('heading', { level: 1, name: heading, exact: true })).toBeVisible()

async function signUp(page: Page, { name, email, password }: { name: string; email: string; password: string }, next?: '/account') {
  await page.goto(next ? `/signup?next=${next}` : '/signup')
  await page.getByLabel('Name').fill(name)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Create account' }).click()
  await landedOn(page, next ? 'Account' : 'Courses')
}

async function logIn(page: Page, email: string, password: string, next?: string) {
  await page.goto(next ? `/login?next=${encodeURIComponent(next)}` : '/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Log in' }).click()
}

async function logOut(page: Page) {
  await header(page).getByRole('button', { name: 'Log out' }).click()
  await expect(header(page).getByRole('link', { name: 'Log in' })).toBeVisible()
}

test.describe('Learner auth', () => {
  test('sign up, log out, and log back in to the page you came from', async ({ page }) => {
    const email = uniqueEmail()
    await signUp(page, { name: 'New Learner', email, password: 'a-good-password' }, '/account')
    await expect(page).toHaveURL(/\/account$/)
    await expect(main(page).getByText(email)).toBeVisible()

    await logOut(page)
    await expect(page).toHaveURL(/\/courses$/)

    await logIn(page, email, 'a-good-password', '/account')
    await landedOn(page, 'Account')
    await expect(page).toHaveURL(/\/account$/)
  })

  test('rejects a short password and a duplicate email', async ({ page }) => {
    await page.goto('/signup')
    await page.getByLabel('Name').fill('Someone')
    await page.getByLabel('Email').fill(uniqueEmail())
    await page.getByLabel('Password').fill('short')
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(main(page).getByRole('alert')).toContainText('at least 8 characters')

    await page.getByLabel('Email').fill(e2eUsers.learner.email)
    await page.getByLabel('Password').fill('a-good-password')
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(main(page).getByRole('alert')).toContainText('already exists')
  })

  test('shows an error for a wrong password', async ({ page }) => {
    await logIn(page, e2eUsers.learner.email, 'not-the-password')
    await expect(main(page).getByRole('alert')).toContainText('don’t match')
    await expect(page).toHaveURL(/\/login/)
  })

  test('ignores an off-site ?next= after logging in', async ({ page }) => {
    await logIn(page, e2eUsers.learner.email, E2E_PASSWORD, 'https://evil.example.com')
    await landedOn(page, 'Courses')
    await expect(page).toHaveURL(/localhost:3100\/courses$/)
  })

  test('resets a forgotten password from the emailed link', async ({ page }) => {
    const email = uniqueEmail()
    await signUp(page, { name: 'Forgetful Learner', email, password: 'original-password' })
    await logOut(page)

    await page.goto('/forgot-password')
    await page.getByLabel('Email').fill(email)
    await page.getByRole('button', { name: 'Send reset link' }).click()
    await expect(main(page).getByRole('status')).toContainText('If an account exists')

    const resetEmail = await latestEmailTo(email)
    expect(resetEmail.subject).toBe('Reset your Quarterly Learnings password')
    expect(resetEmail.replyTo).toBe('info@quarterlylearnings.com')
    expect(resetEmail.html).toContain('72 hours')

    await page.goto(linkIn(resetEmail, '/reset-password?token='))
    await expect(page.getByRole('heading', { name: 'Choose a new password' })).toBeVisible()
    await page.getByLabel('New password').fill('brand-new-password')
    await page.getByRole('button', { name: 'Save password' }).click()
    await landedOn(page, 'Courses')
    await expect(header(page).getByRole('link', { name: 'Account' })).toBeVisible()

    await logOut(page)
    await logIn(page, email, 'brand-new-password')
    await landedOn(page, 'Courses')
    await expect(header(page).getByRole('link', { name: 'Account' })).toBeVisible()
  })

  test('forgot password gives the same answer for unknown emails', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.getByLabel('Email').fill('nobody-here@example.com')
    await page.getByRole('button', { name: 'Send reset link' }).click()
    await expect(main(page).getByRole('status')).toContainText('If an account exists')
  })

  test('an invalid reset token shows a way to request a new link', async ({ page }) => {
    await page.goto('/reset-password?token=not-a-real-token')
    await page.getByLabel('New password').fill('whatever-password')
    await page.getByRole('button', { name: 'Save password' }).click()
    await expect(main(page).getByRole('alert')).toContainText('invalid or has expired')
    await expect(page.getByRole('link', { name: 'Request a new link' })).toBeVisible()
  })

  test('welcome=1 shows the set-password copy', async ({ page }) => {
    await page.goto('/reset-password?token=abc&welcome=1')
    await expect(page.getByRole('heading', { name: 'Set your password' })).toBeVisible()
  })
})

test.describe('Account page (/account)', () => {
  test('redirects logged-out visitors to log in', async ({ page }) => {
    await page.goto('/account')
    await expect(page).toHaveURL(/\/login\?next=(%2F|\/)account$/)
  })

  test('saves a name change', async ({ page }) => {
    await signUp(page, { name: 'Before Name', email: uniqueEmail(), password: 'a-good-password' }, '/account')

    await page.getByLabel('Name').fill('After Name')
    await page.getByRole('button', { name: 'Save name' }).click()
    await expect(main(page).getByRole('status')).toContainText('Name saved')
    // The field keeps the saved value (React resets forms after an action).
    await expect(page.getByLabel('Name')).toHaveValue('After Name')

    // A fresh load comes from the database.
    await page.goto('/account')
    await expect(page.getByLabel('Name')).toHaveValue('After Name')
  })

  test('changes the password after checking the current one', async ({ page }) => {
    const email = uniqueEmail()
    await signUp(page, { name: 'Password Changer', email, password: 'first-password' }, '/account')

    await page.getByLabel('Current password').fill('wrong-password')
    await page.getByLabel('New password').fill('second-password')
    await page.getByRole('button', { name: 'Change password' }).click()
    await expect(main(page).getByRole('alert')).toContainText('current password is incorrect')

    await page.getByLabel('Current password').fill('first-password')
    await page.getByLabel('New password').fill('second-password')
    await page.getByRole('button', { name: 'Change password' }).click()
    await expect(main(page).getByRole('status')).toContainText('Password changed')

    // Still logged in after the change, and the new password works.
    await page.goto('/account')
    await expect(main(page).getByText(email)).toBeVisible()
    await logOut(page)
    await logIn(page, email, 'second-password', '/account')
    await landedOn(page, 'Account')
  })
})
