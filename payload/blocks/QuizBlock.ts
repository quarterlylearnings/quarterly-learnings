import type { Block, Validate } from 'payload'

const validateCorrectIndex: Validate<number> = (value, { siblingData }) => {
  const options = (siblingData as { options?: unknown[] }).options ?? []
  if (value === null || value === undefined) return 'Choose which option is correct.'
  if (!Number.isInteger(value) || value < 0 || value >= options.length) {
    return `Enter the position of the correct option, from 0 to ${Math.max(options.length - 1, 0)}.`
  }
  return true
}

/**
 * Quiz Question block for lesson content (PRD Appendix A.3). `correctIndex`
 * and `explanation` are stripped from lessons for everyone but admins
 * (payload/quiz/answers.ts) and only revealed by grading.
 */
export const QuizBlock: Block = {
  slug: 'quizBlock',
  interfaceName: 'QuizBlockFields',
  labels: { singular: 'Quiz Question', plural: 'Quiz Questions' },
  fields: [
    { name: 'question', type: 'text', required: true },
    {
      name: 'options',
      type: 'array',
      minRows: 2,
      required: true,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'correctIndex',
      type: 'number',
      required: true,
      validate: validateCorrectIndex,
      admin: { description: 'Position of the correct option, counting from 0 (the first option is 0).' },
    },
    { name: 'explanation', type: 'textarea', admin: { description: 'Shown after the learner checks an answer.' } },
  ],
}
