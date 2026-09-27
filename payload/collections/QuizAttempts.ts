import type { Access, CollectionConfig } from 'payload'
import { hiddenFromNonAdmins } from '../access/instructor.ts'
import { isAdmin, userIsAdmin } from '../access/isAdmin.ts'

/** Learners read only their own attempts; admins read all (PRD §5.3). */
const ownOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  if (userIsAdmin(user)) return true
  return { learner: { equals: user.id } }
}

/**
 * Saved quiz answers (PRD §3.3 R7). Written only by the grading server action
 * (payload/quiz/grade.ts), which computes `correct` from the stored block.
 */
export const QuizAttempts: CollectionConfig = {
  slug: 'quiz-attempts',
  admin: {
    hidden: hiddenFromNonAdmins,
    defaultColumns: ['learner', 'lesson', 'quizBlockId', 'correct', 'createdAt'],
  },
  access: {
    read: ownOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  indexes: [{ fields: ['learner', 'lesson', 'quizBlockId'] }],
  fields: [
    { name: 'learner', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'lesson', type: 'relationship', relationTo: 'lessons', required: true, index: true },
    { name: 'quizBlockId', type: 'text', required: true },
    { name: 'selectedIndex', type: 'number', required: true },
    { name: 'correct', type: 'checkbox', required: true, defaultValue: false },
  ],
}
