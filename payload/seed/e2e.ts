import type { Payload } from 'payload'

export const E2E_PASSWORD = 'e2e-password-123'

export const e2eUsers = {
  admin: { email: 'admin@example.com', name: 'Admin User' },
  learner: { email: 'learner@example.com', name: 'Learner User' },
} as const

export const e2eCourses = {
  published: {
    title: 'AI Tool Survey',
    slug: 'ai-tool-survey',
    description: 'A plain-language tour of the AI tools teams are using and what each is good for.',
    level: 'beginner',
  },
  draft: {
    title: 'Unreleased Draft Course',
    slug: 'unreleased-draft-course',
    description: 'This course is still a draft and must not appear in the catalog.',
    level: 'advanced',
  },
} as const

/** Fixtures for Playwright and `npm run dev:local`. Later slices add their own. */
export async function seedE2E(payload: Payload) {
  // First user created becomes admin (Users beforeChange hook).
  await payload.create({ collection: 'users', data: { ...e2eUsers.admin, password: E2E_PASSWORD, role: 'admin' } })
  await payload.create({ collection: 'users', data: { ...e2eUsers.learner, password: E2E_PASSWORD, role: 'learner' } })

  await payload.create({ collection: 'courses', data: { ...e2eCourses.published, _status: 'published' } })
  await payload.create({ collection: 'courses', data: { ...e2eCourses.draft, _status: 'draft' }, draft: true })
}
