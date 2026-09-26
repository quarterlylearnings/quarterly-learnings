import type { Payload } from 'payload'
import { richText } from '../utilities/richText.ts'

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

/** Lessons of the published course, in outline order. */
export const e2eLessons = {
  preview: {
    title: 'What Counts as an AI Tool',
    slug: 'what-counts-as-an-ai-tool',
    order: 1,
    estimatedMinutes: 10,
    preview: true,
    body: 'An AI tool is any product that uses a trained model to draft, summarize, sort or answer.',
  },
  locked: {
    title: 'Choosing a Tool for Your Team',
    slug: 'choosing-a-tool-for-your-team',
    order: 2,
    estimatedMinutes: 15,
    preview: false,
    body: 'Start with the task your team repeats every week, then test two tools against it.',
  },
  draft: {
    title: 'Unfinished Draft Lesson',
    slug: 'unfinished-draft-lesson',
    order: 3,
    estimatedMinutes: 5,
    preview: true,
    body: 'This lesson is still a draft.',
  },
} as const

/** Fixtures for Playwright and `npm run dev:local`. Later slices add their own. */
export async function seedE2E(payload: Payload) {
  // First user created becomes admin (Users beforeChange hook).
  await payload.create({ collection: 'users', data: { ...e2eUsers.admin, password: E2E_PASSWORD, role: 'admin' } })
  await payload.create({ collection: 'users', data: { ...e2eUsers.learner, password: E2E_PASSWORD, role: 'learner' } })

  const course = await payload.create({ collection: 'courses', data: { ...e2eCourses.published, _status: 'published' } })
  await payload.create({ collection: 'courses', data: { ...e2eCourses.draft, _status: 'draft' }, draft: true })

  for (const [key, { body, ...lesson }] of Object.entries(e2eLessons)) {
    const draft = key === 'draft'
    await payload.create({
      collection: 'lessons',
      data: { ...lesson, course: course.id, content: richText([body]), _status: draft ? 'draft' : 'published' },
      draft,
    })
  }
}
