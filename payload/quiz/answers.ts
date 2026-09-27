import type { CollectionAfterReadHook } from 'payload'
import type { QuizBlockFields } from '../../payload-types.ts'
import { userIsAdmin } from '../access/isAdmin.ts'

/** Pass as `context` to read lessons with quiz answers intact (grading only). */
export const WITH_QUIZ_ANSWERS = { withQuizAnswers: true } as const

type Node = { type?: string; fields?: Record<string, unknown>; children?: Node[] }

function* quizNodes(nodes: Node[] | undefined): Generator<Node> {
  for (const node of nodes ?? []) {
    if (node.type === 'block' && node.fields?.blockType === 'quizBlock') yield node
    yield* quizNodes(node.children)
  }
}

/** The quiz blocks in a lesson's content, in document order. */
export function quizBlocks(content: unknown): QuizBlockFields[] {
  const root = (content as { root?: Node } | null | undefined)?.root
  return [...quizNodes(root?.children)].map((node) => node.fields as unknown as QuizBlockFields)
}

/**
 * `lessons` afterRead hook: removes `correctIndex` and `explanation` from quiz
 * blocks unless the reader is an admin (editing) or the server is grading. So
 * neither the page nor the REST/GraphQL API ever sends answers to a learner.
 */
export const stripQuizAnswers: CollectionAfterReadHook = ({ doc, req, context }) => {
  if (userIsAdmin(req.user) || context?.withQuizAnswers) return doc
  const root = (doc?.content as { root?: Node } | null | undefined)?.root
  for (const node of quizNodes(root?.children)) {
    delete node.fields!.correctIndex
    delete node.fields!.explanation
  }
  return doc
}
