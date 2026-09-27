import type { Payload } from 'payload'
import type { Lesson, QuizBlockFields, User } from '../../payload-types.ts'
import { hasCourseAccess } from '../access/hasCourseAccess.ts'
import { userIsAdmin } from '../access/isAdmin.ts'
import { relationId } from '../utilities/relationId.ts'
import { WITH_QUIZ_ANSWERS, quizBlocks } from './answers.ts'

/** What a learner sees after checking an answer. */
export type QuizResult = {
  selectedIndex: number
  correct: boolean
  correctIndex: number
  explanation: string | null
}

export type QuizAttemptInput = { lessonId: string; quizBlockId: string; selectedIndex: number }

export type GradeOutcome = { ok: true; result: QuizResult; saved: boolean } | { ok: false; error: string }

async function lessonWithAnswers(payload: Payload, lessonId: string): Promise<Lesson | null> {
  try {
    const lesson = await payload.findByID({
      collection: 'lessons',
      id: lessonId,
      depth: 0,
      draft: false,
      overrideAccess: true,
      context: WITH_QUIZ_ANSWERS,
    })
    return lesson._status === 'published' ? lesson : null
  } catch {
    return null
  }
}

const resultFor = (block: QuizBlockFields, selectedIndex: number): QuizResult => ({
  selectedIndex,
  correct: selectedIndex === block.correctIndex,
  correctIndex: block.correctIndex,
  explanation: block.explanation ?? null,
})

/**
 * Grades an answer against the stored quiz block (PRD §3.3 R7, Appendix A.5).
 * Only `lessonId`, `quizBlockId` and `selectedIndex` are read from the input,
 * so anything else the client sends (such as `correct`) is ignored.
 *
 * Anyone who can read the lesson may answer: previews are open to everyone,
 * other lessons need course access. Attempts are saved for logged-in readers;
 * logged-out preview readers are graded but nothing is stored (PRD §10).
 */
export async function gradeQuizAttempt(
  payload: Payload,
  user: User | null,
  { lessonId, quizBlockId, selectedIndex }: QuizAttemptInput,
): Promise<GradeOutcome> {
  const lesson = await lessonWithAnswers(payload, String(lessonId))
  const block = lesson && quizBlocks(lesson.content).find((candidate) => candidate.id === quizBlockId)
  if (!lesson || !block) return { ok: false, error: 'We couldn’t find that question. Reload the page and try again.' }

  const courseId = relationId(lesson.course)!
  const canRead =
    lesson.preview === true || userIsAdmin(user) || (user ? await hasCourseAccess(payload, user, courseId) : false)
  if (!canRead) return { ok: false, error: 'Enroll in this course to answer its questions.' }

  if (!Number.isInteger(selectedIndex) || selectedIndex < 0 || selectedIndex >= block.options.length) {
    return { ok: false, error: 'Choose one of the answers.' }
  }

  const result = resultFor(block, selectedIndex)
  if (!user) return { ok: true, result, saved: false }

  await payload.create({
    collection: 'quiz-attempts',
    data: { learner: user.id, lesson: lesson.id, quizBlockId, selectedIndex, correct: result.correct },
    overrideAccess: true,
  })
  return { ok: true, result, saved: true }
}

/** The viewer's latest graded attempt at each quiz block of a lesson, keyed by block id. */
export async function latestQuizResults(
  payload: Payload,
  user: User | null,
  lessonId: string,
): Promise<Record<string, QuizResult>> {
  if (!user) return {}
  const { docs: attempts } = await payload.find({
    collection: 'quiz-attempts',
    where: { and: [{ learner: { equals: user.id } }, { lesson: { equals: lessonId } }] },
    sort: '-createdAt',
    pagination: false,
    depth: 0,
    user,
    overrideAccess: false,
  })
  if (attempts.length === 0) return {}

  const lesson = await lessonWithAnswers(payload, lessonId)
  const blocks = new Map(quizBlocks(lesson?.content).map((block) => [block.id, block]))
  const latest: Record<string, QuizResult> = {}
  for (const attempt of attempts) {
    const block = blocks.get(attempt.quizBlockId)
    if (block && !latest[attempt.quizBlockId]) latest[attempt.quizBlockId] = resultFor(block, attempt.selectedIndex)
  }
  return latest
}
