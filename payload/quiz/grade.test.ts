import type { Payload } from 'payload'
import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import type { Course, Lesson, Offering, QuizBlockFields, User } from '../../payload-types.ts'
import { createCourse, createLesson, createOffering, createUser, daysFromNow, enroll } from '../../test/factories.ts'
import { getTestPayload, resetDb } from '../../test/payload.ts'
import { block, richText } from '../utilities/richText.ts'
import { quizBlocks } from './answers.ts'
import { gradeQuizAttempt, latestQuizResults, type QuizAttemptInput } from './grade.ts'

const QUIZ_ID = '66f5a0000000000000000a01'
const quiz = {
  question: 'Which task suits an AI assistant best?',
  options: [{ text: 'Signing a contract' }, { text: 'Drafting a first summary' }, { text: 'Approving a budget' }],
  correctIndex: 1,
  explanation: 'Drafting is low-risk and easy to check.',
}
const quizContent = richText(['Try this one.'], [block('quizBlock', quiz, QUIZ_ID)])

describe('Quiz grading', () => {
  let payload: Payload
  let admin: User
  let learner: User
  let course: Course
  let offering: Offering
  let preview: Lesson
  let locked: Lesson

  beforeAll(async () => {
    payload = await getTestPayload()
  })

  beforeEach(async () => {
    await resetDb(payload)
    admin = await createUser(payload, 'admin')
    learner = await createUser(payload)
    course = await createCourse(payload)
    offering = await createOffering(payload, course)
    preview = await createLesson(payload, course, { title: 'Preview', preview: true, content: quizContent })
    locked = await createLesson(payload, course, { title: 'Locked', order: 2, preview: false, content: quizContent })
  })

  const answer = (lesson: Lesson, selectedIndex: number): QuizAttemptInput => ({
    lessonId: lesson.id,
    quizBlockId: QUIZ_ID,
    selectedIndex,
  })

  const attempts = () => payload.find({ collection: 'quiz-attempts', depth: 0, pagination: false })

  it('grades against the stored block and saves the attempt for a learner with access', async () => {
    await enroll(payload, learner, offering)
    const wrong = await gradeQuizAttempt(payload, learner, answer(locked, 0))
    expect(wrong).toEqual({
      ok: true,
      saved: true,
      result: { selectedIndex: 0, correct: false, correctIndex: 1, explanation: quiz.explanation },
    })
    const right = await gradeQuizAttempt(payload, learner, answer(locked, 1))
    expect(right.ok && right.result.correct).toBe(true)

    const { docs } = await attempts()
    expect(docs.map((doc) => [doc.learner, doc.lesson, doc.quizBlockId, doc.selectedIndex, doc.correct])).toEqual(
      expect.arrayContaining([
        [learner.id, locked.id, QUIZ_ID, 0, false],
        [learner.id, locked.id, QUIZ_ID, 1, true],
      ]),
    )
  })

  it('ignores a client-supplied `correct`', async () => {
    await enroll(payload, learner, offering)
    const forged = { ...answer(locked, 2), correct: true } as QuizAttemptInput
    const outcome = await gradeQuizAttempt(payload, learner, forged)
    expect(outcome.ok && outcome.result.correct).toBe(false)
    expect((await attempts()).docs[0].correct).toBe(false)
  })

  it('grades a logged-out preview reader without saving anything', async () => {
    const outcome = await gradeQuizAttempt(payload, null, answer(preview, 1))
    expect(outcome).toMatchObject({ ok: true, saved: false, result: { correct: true } })
    expect((await attempts()).totalDocs).toBe(0)
  })

  it('refuses answers on a non-preview lesson without course access', async () => {
    for (const user of [null, learner]) {
      expect(await gradeQuizAttempt(payload, user, answer(locked, 1))).toMatchObject({ ok: false })
    }
    await enroll(payload, learner, offering, { accessExpiresAt: daysFromNow(-1) })
    expect(await gradeQuizAttempt(payload, learner, answer(locked, 1))).toMatchObject({ ok: false })
    expect((await attempts()).totalDocs).toBe(0)
  })

  it('rejects an out-of-range answer and an unknown question', async () => {
    expect(await gradeQuizAttempt(payload, null, answer(preview, 3))).toMatchObject({ ok: false })
    expect(await gradeQuizAttempt(payload, null, answer(preview, -1))).toMatchObject({ ok: false })
    expect(await gradeQuizAttempt(payload, null, { ...answer(preview, 1), quizBlockId: 'nope' })).toMatchObject({
      ok: false,
    })
    expect(await gradeQuizAttempt(payload, null, { ...answer(preview, 1), lessonId: 'not-an-id' })).toMatchObject({
      ok: false,
    })
  })

  it('returns the latest attempt per question for the viewer only', async () => {
    const other = await createUser(payload)
    await enroll(payload, learner, offering)
    await gradeQuizAttempt(payload, learner, answer(locked, 0))
    await new Promise((resolve) => setTimeout(resolve, 5))
    await gradeQuizAttempt(payload, learner, answer(locked, 1))

    expect(await latestQuizResults(payload, learner, locked.id)).toEqual({
      [QUIZ_ID]: { selectedIndex: 1, correct: true, correctIndex: 1, explanation: quiz.explanation },
    })
    expect(await latestQuizResults(payload, other, locked.id)).toEqual({})
    expect(await latestQuizResults(payload, null, locked.id)).toEqual({})
  })

  describe('answer secrecy', () => {
    const quizFieldsFor = async (user?: User) => {
      const doc = await payload.findByID({ collection: 'lessons', id: preview.id, user, overrideAccess: false })
      return quizBlocks(doc.content)[0] as Partial<QuizBlockFields>
    }

    it('strips correctIndex and explanation for anonymous visitors and learners', async () => {
      for (const user of [undefined, learner]) {
        const fields = await quizFieldsFor(user)
        expect(fields.question).toBe(quiz.question)
        expect(fields.options).toHaveLength(3)
        expect(fields).not.toHaveProperty('correctIndex')
        expect(fields).not.toHaveProperty('explanation')
      }
    })

    it('keeps them for admins, who edit the block', async () => {
      expect((await quizFieldsFor(admin)).correctIndex).toBe(1)
    })
  })

  it('lets learners read only their own attempts', async () => {
    const other = await createUser(payload)
    await enroll(payload, learner, offering)
    await enroll(payload, other, offering)
    await gradeQuizAttempt(payload, learner, answer(locked, 0))
    await gradeQuizAttempt(payload, other, answer(locked, 1))

    const { docs } = await payload.find({ collection: 'quiz-attempts', user: learner, overrideAccess: false, depth: 0 })
    expect(docs.map((doc) => doc.learner)).toEqual([learner.id])
    await expect(
      payload.create({
        collection: 'quiz-attempts',
        data: { learner: learner.id, lesson: locked.id, quizBlockId: QUIZ_ID, selectedIndex: 1, correct: true },
        user: learner,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})
