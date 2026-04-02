import { test, expect } from '@playwright/test'

test.describe('Home page (/)', () => {
  test('loads and renders key content', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Quarterly Learnings/)
    await expect(page.getByRole('heading', { name: /Build the skills your team needs/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Get in touch/i }).first()).toHaveAttribute('href', '/contact')
    await expect(page.getByRole('link', { name: /See our work/i })).toHaveAttribute('href', '/work')
  })

  test('renders services section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText(/Technical Training/i).first()).toBeVisible()
    await expect(page.getByText(/AI Implementation/i).first()).toBeVisible()
    await expect(page.getByText(/Two ways to work together/i)).toBeVisible()
  })

  test('renders CTA band', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /Ready to work together/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Get in touch/i }).last()).toHaveAttribute('href', '/contact')
  })
})

test.describe('Design reference (/design)', () => {
  test('loads and renders design system sections', async ({ page }) => {
    await page.goto('/design')

    await expect(page.getByRole('heading', { name: /Color System/i }).first()).toBeVisible()
    await expect(page.getByRole('heading', { name: /Typography Scale/i }).first()).toBeVisible()
  })

  test('renders home page sketch sections', async ({ page }) => {
    await page.goto('/design')

    await expect(page.getByRole('heading', { name: /Build the skills your team needs/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Ready to work together/i })).toBeVisible()
  })
})
