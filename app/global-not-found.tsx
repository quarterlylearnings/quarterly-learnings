import type { Metadata } from 'next'
import { Navigation } from '@/components/Navigation/Navigation'
import { Footer } from '@/components/Footer/Footer'
import { NotFoundContent } from '@/components/NotFoundContent'
import { RootShell } from '@/components/layout/RootShell'

// Unmatched URLs skip every layout (the app has multiple root layouts),
// so this page brings its own shell with the marketing theme.
export const metadata: Metadata = {
  title: 'Page not found — Quarterly Learnings',
}

export default function GlobalNotFound() {
  return (
    <RootShell bodyClassName="theme-site">
      <Navigation transparent={false} />
      <main className="pt-16">
        <NotFoundContent />
      </main>
      <Footer />
    </RootShell>
  )
}
