type LexicalNode = { type: string; version: number; [key: string]: unknown }

/**
 * Lexical editor state for seeds and tests: one paragraph per string, plus any
 * extra top-level nodes (blocks) appended after them. Kept dependency-free so
 * Playwright specs can import the seed module without loading the editor.
 */
export function richText(paragraphs: string[], extraNodes: LexicalNode[] = []) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        ...paragraphs.map((text): LexicalNode => ({
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          direction: 'ltr',
          textFormat: 0,
          textStyle: '',
          children: [{ type: 'text', text, format: 0, style: '', mode: 'normal', detail: 0, version: 1 }],
        })),
        ...extraNodes,
      ],
    },
  }
}
