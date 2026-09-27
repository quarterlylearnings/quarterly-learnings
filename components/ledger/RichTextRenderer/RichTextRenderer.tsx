import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { saveQuizAttempt } from '@/app/(ledger)/courses/actions'
import type { CodeBlockFields, QuizBlockFields } from '@/payload-types'
import { CodeBlockDisplay } from '../CodeBlockDisplay'
import { QuizDisplay, type QuizDisplayResult } from '../QuizDisplay'

type LessonNodes = SerializedBlockNode<CodeBlockFields> | SerializedBlockNode<QuizBlockFields>

type RichTextRendererProps = {
  content: object
  lessonId: string
  /** The viewer's latest attempt per quiz block id. */
  quizResults?: Record<string, QuizDisplayResult>
}

// Each lesson block maps to a learner component.
const converters =
  (lessonId: string, quizResults: Record<string, QuizDisplayResult>): JSXConvertersFunction<LessonNodes> =>
  ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
      codeBlock: ({ node }: { node: SerializedBlockNode<CodeBlockFields> }) => (
        <CodeBlockDisplay code={node.fields.code} language={node.fields.language} caption={node.fields.caption} />
      ),
      // Only the question and option texts reach the client; answers stay on the server.
      quizBlock: ({ node }: { node: SerializedBlockNode<QuizBlockFields> }) => {
        const quizBlockId = String(node.fields.id)
        return (
          <QuizDisplay
            question={node.fields.question}
            options={node.fields.options.map((option) => option.text)}
            check={saveQuizAttempt.bind(null, lessonId, quizBlockId)}
            initialResult={quizResults[quizBlockId] ?? null}
          />
        )
      },
    },
  })

/** Renders a lesson's Lexical content on the server (PRD Appendix A.4). */
export function RichTextRenderer({ content, lessonId, quizResults = {} }: RichTextRendererProps) {
  return (
    <RichText
      data={content as SerializedEditorState}
      converters={converters(lessonId, quizResults)}
      className="prose prose-lg max-w-none font-sans prose-headings:font-serif prose-headings:text-tertiary prose-a:text-primary-text"
    />
  )
}
