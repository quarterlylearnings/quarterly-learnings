'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { getViewer } from '@/lib/ledger/payload'
import { gradeQuizAttempt, type QuizResult } from '@/payload/quiz/grade'

export type QuizCheck = { result: QuizResult } | { error: string }

/**
 * Grades and (for logged-in readers) saves a quiz answer. The lesson page binds
 * `lessonId` and `quizBlockId` per question; everything is re-checked on the
 * server, and `correct` always comes from the stored block.
 */
export async function saveQuizAttempt(lessonId: string, quizBlockId: string, selectedIndex: number): Promise<QuizCheck> {
  const { user } = await getViewer()
  const payload = await getPayload({ config })
  const outcome = await gradeQuizAttempt(payload, user, {
    lessonId: String(lessonId),
    quizBlockId: String(quizBlockId),
    selectedIndex: Number(selectedIndex),
  })
  return outcome.ok ? { result: outcome.result } : { error: outcome.error }
}
