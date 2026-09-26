import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

// Lesson blocks (code examples, quiz questions) add their converters here.
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
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
