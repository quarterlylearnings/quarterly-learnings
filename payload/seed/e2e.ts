import type { Payload } from 'payload'

export const E2E_PASSWORD = 'e2e-password-123'

export const e2eUsers = {
  admin: { email: 'admin@example.com', name: 'Admin User' },
  learner: { email: 'learner@example.com', name: 'Learner User' },
} as const

/** Fixtures for Playwright and `npm run dev:local`. Later slices add their own. */
export async function seedE2E(payload: Payload) {
  // First user created becomes admin (Users beforeChange hook).
  await payload.create({
    collection: 'users',
    data: { ...e2eUsers.admin, password: E2E_PASSWORD, role: 'admin' },
  })
  await payload.create({
    collection: 'users',
    data: { ...e2eUsers.learner, password: E2E_PASSWORD, role: 'learner' },
  })
}
