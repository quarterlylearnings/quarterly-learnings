import type { Block } from 'payload'

export const CODE_LANGUAGES = ['javascript', 'typescript', 'python', 'bash', 'html', 'css', 'json', 'text'] as const

/** Code Example block for lesson content (PRD Appendix A.3). */
export const CodeBlock: Block = {
  slug: 'codeBlock',
  interfaceName: 'CodeBlockFields',
  labels: { singular: 'Code Example', plural: 'Code Examples' },
  fields: [
    {
      name: 'language',
      type: 'select',
      required: true,
      defaultValue: 'javascript',
      options: [...CODE_LANGUAGES],
    },
    { name: 'code', type: 'code', required: true },
    { name: 'caption', type: 'text' },
  ],
}
