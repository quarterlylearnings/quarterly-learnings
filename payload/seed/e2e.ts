import type { Payload } from 'payload'
import { block, richText } from '../utilities/richText.ts'

export const E2E_PASSWORD = 'e2e-password-123'

/**
 * Payload rewrites a user's whole `sessions` array on every login, so parallel
 * logins as one user can drop a session. Each test that logs in as a seeded
 * user gets its own; add one here rather than sharing.
 */
export const e2eUsers = {
  admin: { email: 'admin@example.com', name: 'Admin User' },
  learner: { email: 'learner@example.com', name: 'Learner User' },
  panelProbe: { email: 'panel-probe@example.com', name: 'Panel Probe' },
  /** Active manual enrollment in the published course. */
  enrolled: { email: 'enrolled@example.com', name: 'Enrolled Learner' },
  /** Enrollment whose access ended three days before seeding. */
  expired: { email: 'expired@example.com', name: 'Expired Learner' },
  /** Logged-in learner with no enrollment. */
  unenrolled: { email: 'unenrolled@example.com', name: 'Unenrolled Learner' },
} as const

/** Days from seeding until each seeded learner's access ends. */
export const e2eEnrollments = {
  enrolled: { expiresInDays: 90 },
  expired: { expiresInDays: -3 },
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

/** Code Example block seeded into the preview lesson. */
export const e2eCodeBlock = {
  language: 'javascript',
  code: "const summary = await assistant.summarize('Q3 report')",
  caption: 'Ask an assistant for a summary.',
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
  rollout: {
    title: 'Rolling a Tool Out',
    slug: 'rolling-a-tool-out',
    order: 3,
    estimatedMinutes: 12,
    preview: false,
    body: 'Pick one team to try the tool for two weeks and write down what changed.',
  },
  draft: {
    title: 'Unfinished Draft Lesson',
    slug: 'unfinished-draft-lesson',
    order: 4,
    estimatedMinutes: 5,
    preview: true,
    body: 'This lesson is still a draft.',
  },
} as const

const DAY = 24 * 60 * 60 * 1000
const daysFromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()

/** Offerings of the published course, one per sales state and window case. */
export const e2eOfferings = {
  onSale: { title: 'Open Cohort', salesState: 'on_sale', price: 49900, seatPrice: 39900, openDays: -7, closeDays: 30 },
  notYetOpen: { title: 'Upcoming Cohort', salesState: 'on_sale', price: 52500, openDays: 14 },
  salesEnded: { title: 'Sold Through Cohort', salesState: 'on_sale', price: 44900, openDays: -60, closeDays: -2 },
  unlisted: { title: 'Early List Cohort', salesState: 'unlisted', price: 39900 },
  draft: { title: 'Draft Cohort', salesState: 'draft' },
  closed: { title: 'Closed Cohort', salesState: 'closed', price: 49900 },
} as const

/** An Unlisted offering of a different (draft) course, for "wrong course" checks. */
export const e2eOtherCourseOffering = { title: 'Other Course Cohort', salesState: 'unlisted', price: 10000 } as const

type SeedOffering = {
  title: string
  salesState: 'draft' | 'unlisted' | 'on_sale' | 'closed'
  price?: number
  seatPrice?: number
  openDays?: number
  closeDays?: number
}

const offeringData = (course: string, { openDays, closeDays, ...offering }: SeedOffering) => ({
  ...offering,
  course,
  currency: 'usd' as const,
  salesOpenAt: openDays === undefined ? undefined : daysFromNow(openDays),
  salesCloseAt: closeDays === undefined ? undefined : daysFromNow(closeDays),
})

/** Ids of seeded docs that the public API hides, keyed like the fixtures above. */
export type E2EFixtureIds = { offerings: Record<keyof typeof e2eOfferings | 'otherCourse', string> }

/** Fixtures for Playwright and `npm run dev:local`. Later slices add their own. */
export async function seedE2E(payload: Payload): Promise<E2EFixtureIds> {
  // First user created becomes admin (Users beforeChange hook).
  await payload.create({ collection: 'users', data: { ...e2eUsers.admin, password: E2E_PASSWORD, role: 'admin' } })
  const learners = {} as Record<Exclude<keyof typeof e2eUsers, 'admin'>, string>
  for (const key of ['learner', 'panelProbe', 'enrolled', 'expired', 'unenrolled'] as const) {
    const user = await payload.create({
      collection: 'users',
      data: { ...e2eUsers[key], password: E2E_PASSWORD, role: 'learner' },
    })
    learners[key] = user.id
  }

  const course = await payload.create({ collection: 'courses', data: { ...e2eCourses.published, _status: 'published' } })
  const draftCourse = await payload.create({
    collection: 'courses',
    data: { ...e2eCourses.draft, _status: 'draft' },
    draft: true,
  })

  for (const [key, { body, ...lesson }] of Object.entries(e2eLessons)) {
    const draft = key === 'draft'
    const blocks = key === 'preview' ? [block('codeBlock', e2eCodeBlock, '66f5a0000000000000000001')] : []
    await payload.create({
      collection: 'lessons',
      data: { ...lesson, course: course.id, content: richText([body], blocks), _status: draft ? 'draft' : 'published' },
      draft,
    })
  }

  const offerings = {} as E2EFixtureIds['offerings']
  for (const [key, offering] of Object.entries(e2eOfferings)) {
    const doc = await payload.create({ collection: 'offerings', data: offeringData(course.id, offering) })
    offerings[key as keyof typeof e2eOfferings] = doc.id
  }
  const other = await payload.create({ collection: 'offerings', data: offeringData(draftCourse.id, e2eOtherCourseOffering) })
  offerings.otherCourse = other.id

  for (const [key, { expiresInDays }] of Object.entries(e2eEnrollments)) {
    await payload.create({
      collection: 'enrollments',
      data: {
        learner: learners[key as keyof typeof e2eEnrollments],
        offering: offerings.onSale,
        course: course.id,
        source: 'manual',
        status: 'active',
        accessExpiresAt: daysFromNow(expiresInDays),
      },
    })
  }

  return { offerings }
}
