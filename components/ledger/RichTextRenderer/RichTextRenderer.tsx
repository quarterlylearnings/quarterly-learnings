import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { CodeBlockFields } from '@/payload-types'
import { CodeBlockDisplay } from '../CodeBlockDisplay'

type LessonNodes = SerializedBlockNode<CodeBlockFields>

// Each lesson block maps to a learner component; quiz questions join in DEV-91.
const converters: JSXConvertersFunction<LessonNodes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    codeBlock: ({ node }) => (
      <CodeBlockDisplay code={node.fields.code} language={node.fields.language} caption={node.fields.caption} />
    ),
  },
})

/** Renders a lesson's Lexical content on the server (PRD Appendix A.4). */
export function RichTextRenderer({ content }: { content: object }) {
  return (
    <RichText
      data={content as SerializedEditorState}
      converters={converters}
      className="prose prose-lg max-w-none font-sans prose-headings:font-serif prose-headings:text-tertiary prose-a:text-primary-text"
    />
  )
}
