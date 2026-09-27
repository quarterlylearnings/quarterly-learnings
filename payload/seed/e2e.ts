import type { Payload } from 'payload'
import { placeholderImage } from '../utilities/placeholderImage.ts'
import { block, richText } from '../utilities/richText.ts'

export const E2E_PASSWORD = 'e2e-password-123'

/**
 * Every login attempt writes the user document: a success rewrites the whole
 * `sessions` array, a failure bumps `loginAttempts`. Parallel attempts as one
 * user can collide, so each test that logs in (or fails to) as a seeded user
 * gets its own; add one here rather than sharing.
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
  /** Enrolled; answers the seeded quiz in e2e. */
  quizTaker: { email: 'quiz-taker@example.com', name: 'Quiz Taker' },
  /** Logs in with an off-site ?next= (auth.spec). `learner` takes the wrong-password attempt. */
  offsiteNext: { email: 'offsite-next@example.com', name: 'Offsite Next' },
  /** Enrolled; marks lessons complete in e2e. */
  progressLearner: { email: 'progress-learner@example.com', name: 'Progress Learner' },
  /** Logged in, not enrolled; reads the preview lesson. */
  previewReader: { email: 'preview-reader@example.com', name: 'Preview Reader' },
  /** Enrolled in the Open Cohort; checks the session schedule. */
  sessionLearner: { email: 'session-learner@example.com', name: 'Session Learner' },
  /** Instructor assigned to the published course only (DEV-96). */
  instructor: { email: 'instructor@example.com', name: 'Instructor User' },
} as const

/** Days from seeding until each seeded learner's access ends. */
export const e2eEnrollments = {
  enrolled: { expiresInDays: 90 },
  quizTaker: { expiresInDays: 90 },
  progressLearner: { expiresInDays: 90 },
  sessionLearner: { expiresInDays: 90 },
  expired: { expiresInDays: -3 },
} as const

export const e2eCourses = {
  published: {
    title: 'AI Tool Survey',
    slug: 'ai-tool-survey',
    description: 'A plain-language tour of the AI tools teams are using and what each is good for.',
    level: 'beginner',
  },
  noCover: {
    title: 'Writing Prompts That Work',
    slug: 'writing-prompts-that-work',
    description: 'How to ask an AI tool for what you need, with examples from everyday work.',
    level: 'intermediate',
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

/** Cover image of the published course (`noCover` has none). */
export const e2eCover = { alt: 'Yellow cover for the AI Tool Survey course', filename: 'ai-tool-survey-cover.png' } as const

/** Quiz Question block seeded into the preview lesson. */
export const e2eQuiz = {
  question: 'Which task is the best first job for an AI assistant?',
  options: [{ text: 'Approving the budget' }, { text: 'Drafting a meeting summary' }, { text: 'Signing a contract' }],
  correctIndex: 1,
  explanation: 'A draft summary is easy to check and cheap to get wrong.',
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

const HOUR = 60 * 60 * 1000
const hoursFromNow = (hours: number) => new Date(Date.now() + hours * HOUR).toISOString()

/** Session start and length, relative to seeding. */
type SeedSession = { title: string; startsInHours: number; hours: number; classLink: string }

/** Sessions of the Open Cohort (the one seeded learners are enrolled in). */
export const e2eSessions = {
  ended: { title: 'Kickoff', startsInHours: -48, hours: 1.5, classLink: 'https://meet.example.com/open-kickoff' },
  soon: { title: 'Tools Walkthrough', startsInHours: 1, hours: 1.5, classLink: 'https://meet.example.com/open-walkthrough' },
  later: { title: 'Team Rollout Clinic', startsInHours: 72, hours: 1.5, classLink: 'https://meet.example.com/open-clinic' },
} as const satisfies Record<string, SeedSession>

/** Sessions of other offerings; their links must never reach Open Cohort learners or the public. */
export const e2eOtherSessions = {
  notYetOpen: { title: 'Upcoming Kickoff', startsInHours: 1, hours: 1, classLink: 'https://meet.example.com/upcoming-kickoff' },
  unlisted: { title: 'Early List Kickoff', startsInHours: 1, hours: 1, classLink: 'https://meet.example.com/early-list-kickoff' },
} as const satisfies Record<string, SeedSession>

export const E2E_SESSION_TIMEZONE = 'America/New_York'

const sessionData = ({ title, startsInHours, hours, classLink }: SeedSession) => ({
  title,
  startsAt: hoursFromNow(startsInHours),
  endsAt: hoursFromNow(startsInHours + hours),
  timezone: E2E_SESSION_TIMEZONE,
  classLink,
})

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

const SEEDED_SESSIONS: Partial<Record<keyof typeof e2eOfferings, SeedSession[]>> = {
  onSale: Object.values(e2eSessions),
  notYetOpen: [e2eOtherSessions.notYetOpen],
  unlisted: [e2eOtherSessions.unlisted],
}

const offeringData = (course: string, { openDays, closeDays, ...offering }: SeedOffering, sessions: SeedSession[] = []) => ({
  ...offering,
  course,
  currency: 'usd' as const,
  salesOpenAt: openDays === undefined ? undefined : daysFromNow(openDays),
  salesCloseAt: closeDays === undefined ? undefined : daysFromNow(closeDays),
  sessions: sessions.map(sessionData),
})

/** Ids of seeded docs that the public API hides, keyed like the fixtures above. */
export type E2EFixtureIds = {
  offerings: Record<keyof typeof e2eOfferings | 'otherCourse', string>
  courses: Record<keyof typeof e2eCourses, string>
  lessons: Record<keyof typeof e2eLessons, string>
}

/** Fixtures for Playwright and `npm run dev:local`. Later slices add their own. */
export async function seedE2E(payload: Payload): Promise<E2EFixtureIds> {
  // First user created becomes admin (Users beforeChange hook).
  await payload.create({ collection: 'users', data: { ...e2eUsers.admin, password: E2E_PASSWORD, role: 'admin' } })
  const learners = {} as Record<Exclude<keyof typeof e2eUsers, 'admin'>, string>
  for (const key of Object.keys(e2eUsers).filter((key) => key !== 'admin') as Exclude<keyof typeof e2eUsers, 'admin'>[]) {
    const user = await payload.create({
      collection: 'users',
      data: { ...e2eUsers[key], password: E2E_PASSWORD, role: 'learner' },
    })
    learners[key] = user.id
  }
  // Sign-ups are always learners (Users hook), so the instructor role is set afterwards.
  await payload.update({ collection: 'users', id: learners.instructor, data: { role: 'instructor' } })

  const cover = await payload.create({
    collection: 'media',
    data: { alt: e2eCover.alt },
    file: await placeholderImage(e2eCover.filename),
  })
  const course = await payload.create({
    collection: 'courses',
    data: { ...e2eCourses.published, coverImage: cover.id, instructors: [learners.instructor], _status: 'published' },
  })
  const noCoverCourse = await payload.create({ collection: 'courses', data: { ...e2eCourses.noCover, _status: 'published' } })
  const draftCourse = await payload.create({
    collection: 'courses',
    data: { ...e2eCourses.draft, _status: 'draft' },
    draft: true,
  })

  const lessons = {} as E2EFixtureIds['lessons']
  for (const [key, { body, ...lesson }] of Object.entries(e2eLessons)) {
    const draft = key === 'draft'
    const blocks =
      key === 'preview'
        ? [
            block('codeBlock', e2eCodeBlock, '66f5a0000000000000000001'),
            block('quizBlock', e2eQuiz, '66f5a0000000000000000002'),
          ]
        : []
    const doc = await payload.create({
      collection: 'lessons',
      data: { ...lesson, course: course.id, content: richText([body], blocks), _status: draft ? 'draft' : 'published' },
      draft,
    })
    lessons[key as keyof typeof e2eLessons] = doc.id
  }

  const offerings = {} as E2EFixtureIds['offerings']
  for (const [key, offering] of Object.entries(e2eOfferings)) {
    const sessions = SEEDED_SESSIONS[key as keyof typeof e2eOfferings]
    const doc = await payload.create({ collection: 'offerings', data: offeringData(course.id, offering, sessions) })
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

  return {
    offerings,
    courses: { published: course.id, noCover: noCoverCourse.id, draft: draftCourse.id },
    lessons,
  }
}
