import { Navigation } from '@/components/Navigation/Navigation'
import { Footer } from '@/components/Footer/Footer'
import NextLink from 'next/link'

export default function NotFound() {
  return (
    <>
      <Navigation transparent={false} />

      <main
        className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-8 pt-16"
        style={{ backgroundColor: 'var(--color-tertiary)' }}
      >
        <div className="relative text-center max-w-xl mx-auto">

          {/* Ghost 404 — decorative background number */}
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(10rem, 30vw, 22rem)',
              fontWeight: 700,
              color: 'rgba(128,161,212,0.06)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
            }}
          >
            404
          </span>

          {/* Foreground content */}
          <div className="relative">
            <p
              className="font-semibold uppercase mb-6"
              style={{
                color: 'var(--color-accent)',
                fontSize: 'var(--text-label)',
                letterSpacing: '0.16em',
              }}
            >
              Page not found
            </p>

            <h1
              className="mb-6"
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2rem, 5vw, var(--text-h1))',
                color: 'white',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
              }}
            >
              This page isn&apos;t<br />in the curriculum.
            </h1>

            <p
              className="mb-10 mx-auto"
              style={{
                color: 'rgba(200,215,235,0.6)',
                fontSize: 'var(--text-body)',
                lineHeight: 1.7,
                maxWidth: '380px',
              }}
            >
              Looks like this lesson doesn&apos;t exist. Head back to find what you&apos;re looking for.
            </p>

            <NextLink
              href="/"
              className="inline-block font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--color-primary)', fontSize: 'var(--text-body)' }}
            >
              ← Back to home
            </NextLink>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
