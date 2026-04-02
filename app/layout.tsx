import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quarterly Learnings',
  description: 'Technical instruction and AI implementation consulting.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
