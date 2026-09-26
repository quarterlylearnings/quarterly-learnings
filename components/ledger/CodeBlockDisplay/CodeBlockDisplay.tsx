'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  bash: 'Bash',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
  text: 'Text',
}

export const COPIED_MS = 2000

type CodeBlockDisplayProps = {
  code: string
  language?: string | null
  caption?: string | null
}

/** A lesson's Code Example block: language label, Copy button, dark scrollable code, optional caption. */
export function CodeBlockDisplay({ code, language, caption }: CodeBlockDisplayProps) {
  const [copied, setCopied] = useState(false)
  const label = language ? (LANGUAGE_LABELS[language] ?? language) : 'Code'

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the code stays selectable.
    }
  }

  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-lg bg-tertiary">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="font-sans text-small font-medium text-white/80">{label}</span>
          <Button size="sm" onClick={copy} aria-label={copied ? 'Copied' : `Copy ${label} code`}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
        <pre className="overflow-x-auto p-4 font-mono text-small leading-relaxed text-white" tabIndex={0}>
          <code>{code}</code>
        </pre>
      </div>
      {caption && <figcaption className="mt-2 font-sans text-small text-neutral">{caption}</figcaption>}
      <span role="status" className="sr-only">
        {copied ? 'Code copied to clipboard' : ''}
      </span>
    </figure>
  )
}
