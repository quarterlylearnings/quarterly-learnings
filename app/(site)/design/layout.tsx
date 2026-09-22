import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design System',
  description: 'The Quarterly Learnings design system: color, typography, and components.',
}

export default function DesignLayout({ children }: { children: React.ReactNode }) {
  return children
}
