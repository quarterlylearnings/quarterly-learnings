import Link from 'next/link'

const workCards = [
  { label: 'Training', client: 'Midwest Tech Co.', outcome: 'Trained 12 engineers on a new CI/CD pipeline across 3 focused sessions.' },
  { label: 'AI Implementation', client: 'Harbor Consulting', outcome: 'Automated a manual reporting workflow, saving 8 hours per week.' },
  { label: 'Training', client: 'Northfield Ops', outcome: 'Built a custom Python curriculum for a non-technical operations team.' },
]

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── NAV ── */}
      <header style={{ backgroundColor: 'var(--color-tertiary)' }} className="px-8 lg:px-20 py-5">
        <div style={{ maxWidth: '1280px' }} className="mx-auto flex justify-between items-center">
          <span style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: '1.2rem', letterSpacing: '-0.01em' }}>
            Quarterly Learnings
          </span>
          <nav className="hidden md:flex items-center gap-8">
            {['Services', 'About', 'Work', 'Blog'].map(link => (
              <span key={link}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-small)' }}
                    className="cursor-default">
                {link}
              </span>
            ))}
            <span
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-tertiary)',
                fontSize: 'var(--text-small)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 20px',
              }}
              className="font-semibold cursor-default"
            >
              Contact
            </span>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ backgroundColor: 'var(--color-tertiary)' }} className="px-8 lg:px-20 pt-20 pb-28">
        <div style={{ maxWidth: '1280px' }} className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p
              style={{ color: 'var(--color-primary)', fontSize: 'var(--text-label)', letterSpacing: '0.14em' }}
              className="font-semibold uppercase mb-5"
            >
              Technical Instruction &amp; AI Implementation
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                color: 'white',
                fontSize: 'var(--text-display)',
                lineHeight: 1.08,
                letterSpacing: '-0.02em',
              }}
              className="mb-7"
            >
              Build the skills<br />your team needs.
            </h1>
            <p
              style={{
                color: 'rgba(200,215,235,0.75)',
                fontSize: 'var(--text-body)',
                lineHeight: 1.7,
                maxWidth: '460px',
              }}
              className="mb-10"
            >
              Quarterly Learnings delivers focused technical training for teams and practical AI implementation for small businesses. Expert instruction. Clear outcomes. Real work.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href="/contact"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-tertiary)',
                  fontSize: 'var(--text-body)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 28px',
                }}
                className="font-semibold inline-block"
              >
                Get in touch
              </a>
              <Link
                href="/work"
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: 'var(--text-body)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 28px',
                }}
                className="inline-block"
              >
                See our work
              </Link>
            </div>
          </div>

          {/* Hero image placeholder — swap in real photo when available */}
          <div
            style={{
              backgroundColor: 'rgba(128,161,212,0.08)',
              border: '1px solid rgba(128,161,212,0.18)',
              borderRadius: 'var(--radius-lg)',
              aspectRatio: '4/3',
            }}
            className="flex flex-col items-center justify-center gap-3"
          >
            <div
              style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(128,161,212,0.2)' }}
              className="flex items-center justify-center"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.7">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
              </svg>
            </div>
            <p style={{ color: 'rgba(128,161,212,0.45)', fontSize: 'var(--text-small)', textAlign: 'center' }}>
              Instructor leading a technical workshop<br />with students engaged in the foreground.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES SUMMARY ── */}
      <section style={{ backgroundColor: 'white' }} className="px-8 lg:px-20 py-20">
        <div style={{ maxWidth: '1280px' }} className="mx-auto">
          <p
            style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-label)', letterSpacing: '0.12em' }}
            className="font-semibold uppercase mb-3"
          >
            What we do
          </p>
          <h2
            style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', color: 'var(--color-tertiary)', lineHeight: 1.2 }}
            className="mb-12"
          >
            Two ways to work together.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="/services#training"
              style={{
                border: '1px solid rgba(128,161,212,0.25)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                padding: '40px',
                display: 'block',
                textDecoration: 'none',
                transition: 'box-shadow var(--duration-base) var(--ease-default), border-color var(--duration-base) var(--ease-default)',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(128,161,212,0.12)',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--text-label)',
                  letterSpacing: '0.1em',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                }}
                className="font-semibold uppercase mb-5"
              >
                Technical Training
              </div>
              <h3
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', color: 'var(--color-tertiary)', lineHeight: 1.25 }}
                className="mb-4"
              >
                For teams that need to learn fast.
              </h3>
              <p
                style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-body)', lineHeight: 1.7 }}
                className="mb-6"
              >
                Instructor-led workshops scoped to your team&apos;s exact needs. Whether it&apos;s a new tool, language, or workflow — we build a curriculum that fits your team, not a generic one off the shelf.
              </p>
              <span style={{ color: 'var(--color-primary)', fontSize: 'var(--text-small)' }} className="font-semibold">
                Learn more →
              </span>
            </a>

            <a
              href="/services#ai-implementation"
              style={{
                border: '1px solid rgba(53,88,52,0.2)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                padding: '40px',
                display: 'block',
                textDecoration: 'none',
                transition: 'box-shadow var(--duration-base) var(--ease-default), border-color var(--duration-base) var(--ease-default)',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(53,88,52,0.1)',
                  color: 'var(--color-secondary)',
                  fontSize: 'var(--text-label)',
                  letterSpacing: '0.1em',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 12px',
                }}
                className="font-semibold uppercase mb-5"
              >
                AI Implementation
              </div>
              <h3
                style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', color: 'var(--color-tertiary)', lineHeight: 1.25 }}
                className="mb-4"
              >
                For businesses ready to put AI to work.
              </h3>
              <p
                style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-body)', lineHeight: 1.7 }}
                className="mb-6"
              >
                Scoped consulting to identify where AI tooling can solve a real problem in your business — then implementing it. Plain-language throughout. No unnecessary complexity.
              </p>
              <span style={{ color: 'var(--color-secondary)', fontSize: 'var(--text-small)' }} className="font-semibold">
                Learn more →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── WORK TEASER ── */}
      <section style={{ backgroundColor: 'var(--color-secondary)' }} className="px-8 lg:px-20 py-20">
        <div style={{ maxWidth: '1280px' }} className="mx-auto">
          <p
            style={{ color: 'rgba(255,219,0,0.6)', fontSize: 'var(--text-label)', letterSpacing: '0.12em' }}
            className="font-semibold uppercase mb-3"
          >
            Portfolio
          </p>
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: 'var(--text-h2)', lineHeight: 1.2 }}
            className="mb-12"
          >
            Who we&apos;ve worked with.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {workCards.map(({ label, client, outcome }) => (
              <div
                key={client}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '32px',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'rgba(255,219,0,0.12)',
                    color: 'var(--color-accent)',
                    fontSize: 'var(--text-label)',
                    letterSpacing: '0.1em',
                    borderRadius: 'var(--radius-full)',
                    padding: '4px 12px',
                  }}
                  className="font-semibold uppercase mb-4"
                >
                  {label}
                </div>
                <h3
                  style={{ color: 'white', fontSize: 'var(--text-h4)', lineHeight: 1.4 }}
                  className="font-semibold mb-3"
                >
                  {client}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-small)', lineHeight: 1.65 }}>
                  {outcome}
                </p>
              </div>
            ))}
          </div>
          <Link href="/work" style={{ color: 'var(--color-accent)', fontSize: 'var(--text-small)' }} className="font-semibold">
            View all work →
          </Link>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ backgroundColor: 'var(--color-tertiary)' }} className="px-8 lg:px-20 py-28">
        <div style={{ maxWidth: '720px' }} className="mx-auto text-center">
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              color: 'white',
              fontSize: 'var(--text-h1)',
              lineHeight: 1.12,
              letterSpacing: '-0.02em',
            }}
            className="mb-5"
          >
            Ready to work together?
          </h2>
          <p
            style={{ color: 'rgba(200,215,235,0.6)', fontSize: 'var(--text-body)', lineHeight: 1.7 }}
            className="mb-10"
          >
            Tell us what you&apos;re working on. We&apos;ll figure out if we&apos;re a good fit.
          </p>
          <a
            href="/contact"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-tertiary)',
              fontSize: 'var(--text-body)',
              fontWeight: 700,
              borderRadius: 'var(--radius-sm)',
              padding: '16px 36px',
              display: 'inline-block',
            }}
          >
            Get in touch
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{ backgroundColor: '#0c1a11', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        className="px-8 lg:px-20 py-14"
      >
        <div style={{ maxWidth: '1280px' }} className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div>
              <p
                style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: '1.15rem', letterSpacing: '-0.01em' }}
                className="mb-2"
              >
                Quarterly Learnings
              </p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'var(--text-small)' }}>
                Technical instruction &amp; AI implementation.
              </p>
            </div>
            <nav className="flex gap-8 flex-wrap">
              {[
                { label: 'Home', href: '/' },
                { label: 'Services', href: '/services' },
                { label: 'About', href: '/about' },
                { label: 'Work', href: '/work' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-small)', textDecoration: 'none' }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="pt-6">
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 'var(--text-label)' }}>
              © 2025 Quarterly Learnings. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
