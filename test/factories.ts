import type { Payload } from 'payload'
import type { Course, Enrollment, Lesson, Offering, User } from '../payload-types.ts'
import { richText } from '../payload/utilities/richText.ts'

const DAY = 24 * 60 * 60 * 1000
export const daysFromNow = (days: number, from = Date.now()) => new Date(from + days * DAY).toISOString()

let counter = 0
const unique = () => `${Date.now().toString(36)}-${++counter}`

export function createUser(payload: Payload, role: User['role'] = 'learner', data: Partial<User> = {}) {
  return payload.create({
    collection: 'users',
    data: { email: `${role}-${unique()}@example.com`, password: 'pw-123456', role, ...data },
  })
}

export function createCourse(payload: Payload, title = `Course ${unique()}`) {
  return payload.create({
    collection: 'courses',
    data: { title, slug: '', description: 'A course.', level: 'beginner', _status: 'published' },
  })
}

export function createLesson(payload: Payload, course: Course, data: Partial<Lesson> & { title: string }) {
  return payload.create({
    collection: 'lessons',
    data: { course: course.id, order: 1, slug: '', content: richText(['Lesson body.']), _status: 'published', ...data },
  })
}

export function createOffering(payload: Payload, course: Course, data: Partial<Offering> = {}) {
  return payload.create({
    collection: 'offerings',
    data: { course: course.id, title: `Offering ${unique()}`, salesState: 'on_sale', price: 49900, currency: 'usd', ...data },
  })
}

export function enroll(
  payload: Payload,
  learner: User,
  offering: Offering,
  data: Partial<Pick<Enrollment, 'status' | 'source' | 'accessExpiresAt'>> = {},
) {
  return payload.create({
    collection: 'enrollments',
    data: {
      learner: learner.id,
      offering: offering.id,
      // Filled from the offering by the Enrollments hook.
      course: offering.course as string,
      source: 'manual',
      status: 'active',
      accessExpiresAt: daysFromNow(30),
      ...data,
    },
  })
}
