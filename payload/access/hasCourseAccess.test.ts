import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Course, Offering, User } from '../../payload-types.ts'
import { createCourse, createOffering, createUser, daysFromNow, enroll } from '../../test/factories.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'
import { courseAccess, hasCourseAccess } from './hasCourseAccess.ts'

describe('hasCourseAccess', () => {
  let payload: Payload
  let learner: User
  let course: Course
  let offering: Offering

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    learner = await createUser(payload)
    course = await createCourse(payload)
    offering = await createOffering(payload, course)
  })

  it('grants access with an active, unexpired enrollment', async () => {
    await enroll(payload, learner, offering)
    expect(await hasCourseAccess(payload, learner, course.id)).toBe(true)
  })

  it.each(['refunded', 'revoked'] as const)('denies access when the enrollment is %s', async (status) => {
    await enroll(payload, learner, offering, { status })
    expect(await hasCourseAccess(payload, learner, course.id)).toBe(false)
    expect((await courseAccess(payload, learner, course.id)).state).toBe('none')
  })

  it('denies access once accessExpiresAt has passed, and reports when it ended', async () => {
    const endedAt = daysFromNow(-1)
    await enroll(payload, learner, offering, { accessExpiresAt: endedAt })
    expect(await hasCourseAccess(payload, learner, course.id)).toBe(false)
    expect(await courseAccess(payload, learner, course.id)).toEqual({ state: 'expired', endedAt: new Date(endedAt) })
  })

  it('treats the exact expiry instant as expired', async () => {
    const expiresAt = daysFromNow(1)
    await enroll(payload, learner, offering, { accessExpiresAt: expiresAt })
    const access = await courseAccess(payload, learner, course.id, undefined, new Date(expiresAt))
    expect(access.state).toBe('expired')
  })

  it('does not carry access to a different course', async () => {
    const other = await createCourse(payload)
    await enroll(payload, learner, offering)
    expect(await hasCourseAccess(payload, learner, other.id)).toBe(false)
  })

  it('does not grant access to another learner', async () => {
    const someoneElse = await createUser(payload)
    await enroll(payload, learner, offering)
    expect(await hasCourseAccess(payload, someoneElse, course.id)).toBe(false)
  })

  it('denies anonymous visitors', async () => {
    expect(await hasCourseAccess(payload, null, course.id)).toBe(false)
  })

  it('uses the latest active enrollment when a learner has several offerings of the course', async () => {
    const second = await createOffering(payload, course)
    await enroll(payload, learner, offering, { accessExpiresAt: daysFromNow(-10) })
    await enroll(payload, learner, second, { accessExpiresAt: daysFromNow(10) })
    expect(await hasCourseAccess(payload, learner, course.id)).toBe(true)
  })
})
