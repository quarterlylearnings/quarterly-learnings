import NextLink from 'next/link'
import { Mail, Music2, Mic2 } from 'lucide-react'
import type { ComponentType } from 'react'

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

const socialLinks: Array<{
  label: string
  href: string
  icon: ComponentType<{ className?: string }>
  external?: boolean
}> = [
  { label: 'Email', href: 'mailto:info@quarterlylearnings.com', icon: Mail },
  { label: 'YouTube', href: 'https://youtube.com', icon: YouTubeIcon, external: true },
  { label: 'TikTok', href: 'https://tiktok.com', icon: Music2, external: true },
  { label: 'Podcast', href: 'https://podcast.quarterlylearnings.com', icon: Mic2, external: true },
]

export function Footer() {
  return (
    <footer
      className="border-t border-white/5"
      style={{ backgroundColor: '#0c1a11' }}
    >
      <div className="mx-auto max-w-7xl px-8 lg:px-20 py-14">

        {/* Top row — wordmark + nav links */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">

          {/* Wordmark + tagline */}
          <div>
            <NextLink
              href="/"
              className="font-serif text-white/90 hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', letterSpacing: '-0.01em' }}
            >
              Quarterly Learnings
            </NextLink>
            <p className="font-sans mt-1.5 text-white/55" style={{ fontSize: 'var(--text-small)' }}>
              Technical instruction &amp; AI implementation.
            </p>
          </div>

          {/* Nav links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <NextLink
                    href={href}
                    className="font-sans text-white/55 hover:text-white/90 transition-colors min-h-[44px] inline-flex items-center"
                    style={{ fontSize: 'var(--text-small)' }}
                  >
                    {label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-white/6 mb-6" />

        {/* Bottom row — social links + copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          {/* Social / contact icons */}
          <div className="flex items-center gap-1">
            {socialLinks.map(({ label, href, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex h-11 w-11 items-center justify-center rounded-md text-white/55 hover:text-white/90 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="font-sans text-white/50" style={{ fontSize: 'var(--text-label)' }}>
            © {new Date().getFullYear()} Quarterly Learnings. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
