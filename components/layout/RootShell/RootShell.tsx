import type { Metadata } from 'next'
import { Lora, Red_Hat_Display } from 'next/font/google'
import '@/app/globals.css'

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const redHatDisplay = Red_Hat_Display({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const rootMetadata: Metadata = {
  title: {
    default: 'Quarterly Learnings',
    template: '%s — Quarterly Learnings',
  },
  description: 'Technical instruction and AI implementation consulting.',
  icons: { icon: '/favicon.png' },
}

/**
 * Shared <html>/<body> for every root layout ((site), (learn), global-not-found)
 * so fonts, global styles and metadata can't drift between them.
 */
export function RootShell({
  children,
  bodyClassName,
}: {
  children: React.ReactNode
  bodyClassName?: string
}) {
  return (
    <html lang="en" className={`${lora.variable} ${redHatDisplay.variable}`}>
      <body className={bodyClassName}>{children}</body>
    </html>
  )
}
