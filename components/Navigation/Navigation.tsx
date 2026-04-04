'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import NextLink from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Blog', href: '/blog' },
]

type NavigationProps = {
  currentPath?: string
  transparent?: boolean
}

export function Navigation({ currentPath, transparent: transparentProp }: NavigationProps) {
  const pathname = usePathname()
  const activePath = currentPath ?? pathname
  const transparent = transparentProp ?? activePath === '/'

  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!transparent) return
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [transparent])

  const showSolid = !transparent || scrolled

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-colors duration-[var(--duration-base)] ease-[var(--ease-default)]"
        style={{ backgroundColor: showSolid ? 'var(--color-tertiary)' : 'transparent' }}
      >
        <div className="mx-auto max-w-7xl px-8 lg:px-20 flex items-center justify-between h-16">

          {/* Wordmark */}
          <NextLink
            href="/"
            className="font-serif text-white hover:text-white/80 transition-colors"
            style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', letterSpacing: '-0.01em' }}
          >
            Quarterly Learnings
          </NextLink>

          {/* Desktop nav */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            {navLinks.map(({ label, href }) => (
              <NextLink
                key={href}
                href={href}
                className="font-sans text-small transition-colors"
                style={{
                  color: activePath === href ? 'var(--color-primary)' : 'rgba(255,255,255,0.6)',
                }}
                onMouseOver={e => {
                  if (activePath !== href) e.currentTarget.style.color = 'rgba(255,255,255,0.9)'
                }}
                onMouseOut={e => {
                  if (activePath !== href) e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
                }}
              >
                {label}
              </NextLink>
            ))}
            <Button variant="primary" size="sm" as="a" href="/contact">
              Contact
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-md text-white/80 hover:text-white transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsOpen(prev => !prev)}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>

        </div>
      </header>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            aria-hidden="true"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer */}
          <nav
            id="mobile-menu"
            aria-label="Main navigation"
            className="fixed top-16 left-0 right-0 z-40 md:hidden border-t border-white/10"
            style={{ backgroundColor: 'var(--color-tertiary)' }}
          >
            <ul className="flex flex-col px-8 py-4">
              {navLinks.map(({ label, href }) => (
                <li key={href}>
                  <NextLink
                    href={href}
                    className="font-sans text-body min-h-[44px] flex items-center transition-colors"
                    style={{
                      color: activePath === href ? 'var(--color-primary)' : 'rgba(255,255,255,0.7)',
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </NextLink>
                </li>
              ))}
              <li className="pt-2 pb-2">
                <Button
                  variant="primary"
                  size="sm"
                  as="a"
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Button>
              </li>
            </ul>
          </nav>
        </>
      )}
    </>
  )
}
