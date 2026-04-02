import type { Metadata } from 'next'
import { Lora, Red_Hat_Display } from 'next/font/google'
import './globals.css'

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
    <html lang="en" className={`${lora.variable} ${redHatDisplay.variable}`}>
      <body>{children}</body>
    </html>
  )
}
