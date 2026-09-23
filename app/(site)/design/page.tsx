'use client'

import { Button } from '@/components/ui/Button'
import { Link } from '@/components/ui/Link'
import { Badge } from '@/components/ui/Badge'
import { Divider } from '@/components/ui/Divider'
import { Card } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { Radio, RadioGroup } from '@/components/ui/Radio'
import { FormField } from '@/components/ui/FormField'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { Inbox } from 'lucide-react'

// ── Data ─────────────────────────────────────────────────────────────────────

const colors = [
  { name: 'Primary', token: '--color-primary', hex: '#80A1D4', role: 'Interactive elements, links, buttons, focus rings' },
  { name: 'Secondary', token: '--color-secondary', hex: '#355834', role: 'Section accents, supporting UI elements' },
  { name: 'Tertiary', token: '--color-tertiary', hex: '#14281D', role: 'Dark backgrounds, hero surfaces, deep text' },
  { name: 'Accent', token: '--color-accent', hex: '#FFDB00', role: 'Key CTAs, highlights — use sparingly' },
  { name: 'Neutral', token: '--color-neutral', hex: '#6E633D', role: 'Body text, borders, subdued labels' },
  { name: 'Error', token: '--color-error', hex: '#C0392B', role: 'Form errors, destructive feedback' },
]

const typeScale = [
  { name: 'display', label: 'Display', size: '3.5rem / 56px', font: 'Lora', specimen: 'Build the skills your team needs.' },
  { name: 'h1', label: 'H1', size: '2.75rem / 44px', font: 'Lora', specimen: 'Technical Training for Teams' },
  { name: 'h2', label: 'H2', size: '2rem / 32px', font: 'Lora', specimen: 'Who we\'ve worked with.' },
  { name: 'h3', label: 'H3', size: '1.5rem / 24px', font: 'Red Hat Display', specimen: 'For teams that need to learn fast.' },
  { name: 'h4', label: 'H4', size: '1.125rem / 18px', font: 'Red Hat Display', specimen: 'Technical Instruction & AI Implementation' },
  { name: 'body', label: 'Body', size: '1rem / 16px', font: 'Red Hat Display', specimen: 'Quarterly Learnings delivers focused technical training for teams and practical AI implementation for small businesses. Expert instruction. Clear outcomes. Real work.' },
  { name: 'small', label: 'Small', size: '0.875rem / 14px', font: 'Red Hat Display', specimen: 'Captions, supporting text, supplementary information.' },
  { name: 'label', label: 'Label', size: '0.75rem / 12px', font: 'Red Hat Display', specimen: 'UI LABELS · TAGS · METADATA' },
]

const workCards = [
  { label: 'Training', client: 'Midwest Tech Co.', outcome: 'Trained 12 engineers on a new CI/CD pipeline across 3 focused sessions.' },
  { label: 'AI Implementation', client: 'Harbor Consulting', outcome: 'Automated a manual reporting workflow, saving 8 hours per week.' },
  { label: 'Training', client: 'Northfield Ops', outcome: 'Built a custom Python curriculum for a non-technical operations team.' },
]

const serviceOptions = [
  { value: 'training', label: 'Technical Training' },
  { value: 'ai', label: 'AI Implementation' },
  { value: 'both', label: 'Both' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', color: 'var(--color-tertiary)' }}
      className="mb-8"
    >
      {children}
    </h2>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-label)', letterSpacing: '0.12em' }}
      className="font-semibold uppercase mb-5"
    >
      {children}
    </p>
  )
}

function ComponentGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <SubHeading>{title}</SubHeading>
      {children}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DesignReferencePage() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>

      {/* ── REFERENCE BANNER ── */}
      <div
        style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-tertiary)' }}
        className="px-6 py-2.5 text-center"
      >
        <span style={{ fontSize: 'var(--text-label)', letterSpacing: '0.12em' }} className="font-bold uppercase">
          Visual Direction Reference · DEV-29 · Not a finished page
        </span>
      </div>

      {/* ── DESIGN TOKENS ── */}
      <section style={{ backgroundColor: '#f7f6f2' }} className="px-8 lg:px-20 py-16">
        <div style={{ maxWidth: '1280px' }} className="mx-auto">

          <SectionHeading>Color System</SectionHeading>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
            {colors.map(({ name, token, hex, role }) => (
              <div key={token}>
                <div
                  className="rounded-md mb-3 aspect-square"
                  style={{ backgroundColor: hex, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}
                />
                <p style={{ fontSize: 'var(--text-h4)', color: 'var(--color-tertiary)' }} className="font-semibold mb-0.5">{name}</p>
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', fontFamily: 'monospace' }} className="mb-1">{hex}</p>
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', lineHeight: 1.4 }}>{role}</p>
              </div>
            ))}
          </div>

          <SectionHeading>Typography Scale</SectionHeading>
          <div className="space-y-8">
            {typeScale.map(({ name, label, size, font, specimen }) => (
              <div key={name} className="flex gap-6 items-baseline border-b pb-8" style={{ borderColor: 'rgba(110,99,61,0.15)' }}>
                <div className="shrink-0 w-20">
                  <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', letterSpacing: '0.08em' }} className="font-semibold uppercase">{label}</p>
                  <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', fontFamily: 'monospace' }}>{size}</p>
                  <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)' }}>{font}</p>
                </div>
                <p
                  style={{
                    fontFamily: ['display', 'h1', 'h2'].includes(name) ? 'var(--font-serif)' : 'var(--font-sans)',
                    fontSize: `var(--text-${name})`,
                    color: 'var(--color-tertiary)',
                    lineHeight: name === 'display' ? 1.1 : name === 'h1' ? 1.15 : name === 'h2' ? 1.2 : name === 'h3' ? 1.3 : 1.6,
                    fontWeight: ['display', 'h1'].includes(name) ? 700 : ['h2'].includes(name) ? 600 : ['h3', 'h4'].includes(name) ? 600 : 400,
                  }}
                >
                  {specimen}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          UI COMPONENTS
      ════════════════════════════════════════════ */}

      <div style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-tertiary)' }}
           className="px-6 py-2 text-center">
        <span style={{ fontSize: 'var(--text-label)', letterSpacing: '0.16em' }} className="font-bold uppercase">
          ↓ UI Components · DEV-33 ↓
        </span>
      </div>

      <section style={{ backgroundColor: '#f7f6f2' }} className="px-8 lg:px-20 py-16">
        <div style={{ maxWidth: '1280px' }} className="mx-auto">

          {/* ── Button ── */}
          <ComponentGroup title="Button">
            <div className="flex flex-col gap-6">
              <div>
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)' }} className="mb-3 uppercase tracking-widest font-semibold">Variants</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)' }} className="mb-3 uppercase tracking-widest font-semibold">Sizes</p>
                <div className="flex flex-wrap items-end gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)' }} className="mb-3 uppercase tracking-widest font-semibold">States</p>
                <div className="flex flex-wrap items-center gap-4">
                  <Button variant="primary" loading>Loading</Button>
                  <Button variant="primary" disabled>Disabled</Button>
                  <Button variant="secondary" loading>Sending…</Button>
                  <Button variant="ghost" disabled>Ghost disabled</Button>
                </div>
              </div>
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── Link ── */}
          <ComponentGroup title="Link">
            <div className="flex flex-col gap-4 items-start">
              <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-tertiary)' }}>
                We help teams build real skills with{' '}
                <Link href="#" variant="inline">practical technical training</Link>
                {' '}that actually sticks.
              </p>
              <Link href="#" variant="standalone">Explore our approach</Link>
              <Link href="https://example.com" variant="standalone" external>View external resource</Link>
              <nav className="flex gap-6">
                {['Services', 'Work', 'Blog', 'Contact'].map(label => (
                  <Link key={label} href="#" variant="nav">{label}</Link>
                ))}
              </nav>
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── Badge ── */}
          <ComponentGroup title="Badge">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default" label="Default" />
                <Badge variant="outline" label="Outline" />
                <Badge variant="subtle" label="Subtle" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="default" size="sm" label="Small default" />
                <Badge variant="outline" size="sm" label="Small outline" />
                <Badge variant="subtle" size="sm" label="Small subtle" />
              </div>
              <div className="flex items-center gap-3">
                <span style={{ fontSize: 'var(--text-body)', color: 'var(--color-tertiary)' }}>AI Implementation</span>
                <Badge variant="subtle" size="sm" label="New" />
              </div>
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── Divider ── */}
          <ComponentGroup title="Divider">
            <div className="flex flex-col gap-6 max-w-lg">
              <Divider variant="line" />
              <Divider variant="labeled" label="or" />
              <Divider variant="labeled" label="Services" />
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── Card ── */}
          <ComponentGroup title="Card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card variant="default">
                <Card.Header>
                  <Badge variant="subtle" size="sm" label="Default" />
                </Card.Header>
                <Card.Body>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', color: 'var(--color-tertiary)' }} className="mb-2">Technical Training</h3>
                  <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-neutral)', lineHeight: 1.6 }}>Focused skill-building for engineering teams who need to move fast.</p>
                </Card.Body>
                <Card.Footer>
                  <Link href="#" variant="standalone">Learn more</Link>
                </Card.Footer>
              </Card>

              <Card variant="flat">
                <Card.Header>
                  <Badge variant="subtle" size="sm" label="Flat" />
                </Card.Header>
                <Card.Body>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', color: 'var(--color-tertiary)' }} className="mb-2">AI Implementation</h3>
                  <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-neutral)', lineHeight: 1.6 }}>Practical AI for businesses ready to put it to real work.</p>
                </Card.Body>
                <Card.Footer>
                  <Link href="#" variant="standalone">Learn more</Link>
                </Card.Footer>
              </Card>

              <Card variant="interactive" onClick={() => {}}>
                <Card.Header>
                  <Badge variant="subtle" size="sm" label="Interactive" />
                </Card.Header>
                <Card.Body>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', color: 'var(--color-tertiary)' }} className="mb-2">Case Study</h3>
                  <p style={{ fontSize: 'var(--text-body)', color: 'var(--color-neutral)', lineHeight: 1.6 }}>Keyboard accessible — Tab + Enter/Space to activate.</p>
                </Card.Body>
              </Card>
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── Avatar ── */}
          <ComponentGroup title="Avatar">
            <div className="flex flex-wrap items-end gap-8">
              <div className="flex flex-col items-center gap-2">
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)' }} className="uppercase tracking-widest font-semibold">Logo</p>
                <div className="flex items-end gap-3">
                  <Avatar variant="logo" src="/placeholder-logo.svg" alt="Quarterly Learnings" size="sm" />
                  <Avatar variant="logo" src="/placeholder-logo.svg" alt="Quarterly Learnings" size="md" />
                  <Avatar variant="logo" src="/placeholder-logo.svg" alt="Quarterly Learnings" size="lg" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)' }} className="uppercase tracking-widest font-semibold">Initials</p>
                <div className="flex items-end gap-3">
                  <Avatar variant="initials" name="Quarterly Learnings" size="sm" />
                  <Avatar variant="initials" name="Quarterly Learnings" size="md" />
                  <Avatar variant="initials" name="Quarterly Learnings" size="lg" />
                </div>
              </div>
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── EmptyState ── */}
          <ComponentGroup title="EmptyState">
            <div className="max-w-md border border-neutral/20 rounded-lg bg-white">
              <EmptyState
                icon={Inbox}
                heading="No case studies yet"
                description="We haven't published work in this category. Check back soon or browse everything."
                cta={{ label: 'Browse all work', onClick: () => {} }}
              />
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── Form Components ── */}
          <ComponentGroup title="Form Components">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
              <Input label="Full name" placeholder="Jane Smith" />
              <Input label="Email address" type="email" placeholder="you@company.com" required />
              <Input label="With error" defaultValue="bad-email" error="Please enter a valid email address." />
              <Input label="Disabled" defaultValue="Quarterly Learnings" disabled />
              <Textarea label="Message" placeholder="Tell us about your project…" rows={4} />
              <Select label="Service interested in" options={serviceOptions} placeholder="Select a service…" />
            </div>

            <div className="mt-8 flex flex-col gap-4 max-w-xs">
              <Checkbox label="Subscribe to updates" />
              <Checkbox label="I agree to the terms" defaultChecked />
              <Checkbox label="Unavailable option" disabled />
            </div>

            <div className="mt-8">
              <RadioGroup legend="Which service are you interested in?">
                <Radio name="service-ref" value="training" label="Technical Training" defaultChecked />
                <Radio name="service-ref" value="ai" label="AI Implementation" />
                <Radio name="service-ref" value="both" label="Both" />
              </RadioGroup>
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── FormField ── */}
          <ComponentGroup title="FormField">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
              <FormField label="Default" id="ff-1">
                <input id="ff-1" type="text" placeholder="Placeholder" className="w-full rounded-md border border-neutral/30 bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none focus:ring-2 focus:ring-primary" />
              </FormField>
              <FormField label="With helper" id="ff-2" helperText="Only used to reply to your enquiry.">
                <input id="ff-2" type="email" placeholder="you@example.com" className="w-full rounded-md border border-neutral/30 bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none focus:ring-2 focus:ring-primary" />
              </FormField>
              <FormField label="With error" id="ff-3" error="This field is required." required>
                <input id="ff-3" type="text" aria-invalid="true" aria-describedby="ff-3-error" className="w-full rounded-md border border-error bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none focus:ring-2 focus:ring-error" />
              </FormField>
            </div>
          </ComponentGroup>

          <Divider className="mb-12" />

          {/* ── StatusMessage ── */}
          <ComponentGroup title="StatusMessage">
            <div className="flex flex-col gap-4 max-w-md">
              <StatusMessage variant="success" message="Your message has been sent. We'll be in touch within one business day." />
              <StatusMessage variant="error" message="Something went wrong. Please try again or email us directly." />
              <StatusMessage variant="info" message="This form is currently unavailable. Please check back soon." />
            </div>
          </ComponentGroup>

        </div>
      </section>

      {/* ════════════════════════════════════════════
          HOME PAGE SKETCH
      ════════════════════════════════════════════ */}

      <div style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-tertiary)' }}
           className="px-6 py-2 text-center">
        <span style={{ fontSize: 'var(--text-label)', letterSpacing: '0.16em' }} className="font-bold uppercase">
          ↓ Home Page Sketch ↓
        </span>
      </div>

      {/* ── NAV SKETCH ── */}
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
              style={{ color: 'rgba(200,215,235,0.75)', fontSize: 'var(--text-body)', lineHeight: 1.7, maxWidth: '460px' }}
              className="mb-10"
            >
              Quarterly Learnings delivers focused technical training for teams and practical AI implementation for small businesses. Expert instruction. Clear outcomes. Real work.
            </p>
            <div className="flex gap-4 flex-wrap">
              <span
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-tertiary)',
                  fontSize: 'var(--text-body)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 28px',
                }}
                className="font-semibold cursor-default inline-block"
              >
                Get in touch
              </span>
              <span
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  fontSize: 'var(--text-body)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 28px',
                }}
                className="cursor-default inline-block"
              >
                See our work
              </span>
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'rgba(128,161,212,0.08)',
              border: '1px solid rgba(128,161,212,0.18)',
              borderRadius: 'var(--radius-lg)',
              aspectRatio: '4/3',
            }}
            className="flex flex-col items-center justify-center gap-3"
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(128,161,212,0.2)' }}
                 className="flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" opacity="0.7">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
              </svg>
            </div>
            <p style={{ color: 'rgba(128,161,212,0.5)', fontSize: 'var(--text-small)', textAlign: 'center' }}>
              Instructor leading a technical workshop<br />with students engaged in the foreground.
            </p>
          </div>
        </div>
      </section>

      {/* ── SERVICES SUMMARY ── */}
      <section className="px-8 lg:px-20 py-20" style={{ backgroundColor: 'white' }}>
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
            <div style={{ border: '1px solid rgba(128,161,212,0.25)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '40px' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(128,161,212,0.12)', color: 'var(--color-primary)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', borderRadius: 'var(--radius-full)', padding: '4px 12px' }} className="font-semibold uppercase mb-5">
                Technical Training
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', color: 'var(--color-tertiary)', lineHeight: 1.25 }} className="mb-4">
                For teams that need to learn fast.
              </h3>
              <p style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-body)', lineHeight: 1.7 }} className="mb-6">
                Instructor-led workshops scoped to your team&apos;s exact needs. Whether it&apos;s a new tool, language, or workflow — we build a curriculum that fits your team, not a generic one off the shelf.
              </p>
              <span style={{ color: 'var(--color-primary)', fontSize: 'var(--text-small)' }} className="font-semibold cursor-default">Learn more →</span>
            </div>
            <div style={{ border: '1px solid rgba(53,88,52,0.2)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', padding: '40px' }}>
              <div style={{ display: 'inline-block', backgroundColor: 'rgba(53,88,52,0.1)', color: 'var(--color-secondary)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', borderRadius: 'var(--radius-full)', padding: '4px 12px' }} className="font-semibold uppercase mb-5">
                AI Implementation
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)', color: 'var(--color-tertiary)', lineHeight: 1.25 }} className="mb-4">
                For businesses ready to put AI to work.
              </h3>
              <p style={{ color: 'var(--color-neutral)', fontSize: 'var(--text-body)', lineHeight: 1.7 }} className="mb-6">
                Scoped consulting to identify where AI tooling can solve a real problem in your business — then implementing it. Plain-language throughout. No unnecessary complexity.
              </p>
              <span style={{ color: 'var(--color-secondary)', fontSize: 'var(--text-small)' }} className="font-semibold cursor-default">Learn more →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WORK TEASER ── */}
      <section style={{ backgroundColor: 'var(--color-secondary)' }} className="px-8 lg:px-20 py-20">
        <div style={{ maxWidth: '1280px' }} className="mx-auto">
          <p style={{ color: 'rgba(255,219,0,0.6)', fontSize: 'var(--text-label)', letterSpacing: '0.12em' }} className="font-semibold uppercase mb-3">Portfolio</p>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: 'var(--text-h2)', lineHeight: 1.2 }} className="mb-12">
            Who we&apos;ve worked with.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {workCards.map(({ label, client, outcome }) => (
              <div key={client} style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', padding: '32px' }}>
                <div style={{ display: 'inline-block', backgroundColor: 'rgba(255,219,0,0.12)', color: 'var(--color-accent)', fontSize: 'var(--text-label)', letterSpacing: '0.1em', borderRadius: 'var(--radius-full)', padding: '4px 12px' }} className="font-semibold uppercase mb-4">
                  {label}
                </div>
                <h3 style={{ color: 'white', fontSize: 'var(--text-h4)', lineHeight: 1.4 }} className="font-semibold mb-3">{client}</h3>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 'var(--text-small)', lineHeight: 1.65 }}>{outcome}</p>
              </div>
            ))}
          </div>
          <span style={{ color: 'var(--color-accent)', fontSize: 'var(--text-small)' }} className="font-semibold cursor-default">View all work →</span>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ backgroundColor: 'var(--color-tertiary)' }} className="px-8 lg:px-20 py-28">
        <div style={{ maxWidth: '720px' }} className="mx-auto text-center">
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: 'var(--text-h1)', lineHeight: 1.12, letterSpacing: '-0.02em' }} className="mb-5">
            Ready to work together?
          </h2>
          <p style={{ color: 'rgba(200,215,235,0.6)', fontSize: 'var(--text-body)', lineHeight: 1.7 }} className="mb-10">
            Tell us what you&apos;re working on. We&apos;ll figure out if we&apos;re a good fit.
          </p>
          <span style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-tertiary)', fontSize: 'var(--text-body)', fontWeight: 700, borderRadius: 'var(--radius-sm)', padding: '16px 36px', display: 'inline-block' }} className="cursor-default">
            Get in touch
          </span>
        </div>
      </section>

      {/* ── FOOTER SKETCH ── */}
      <footer style={{ backgroundColor: '#0c1a11', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="px-8 lg:px-20 py-14">
        <div style={{ maxWidth: '1280px' }} className="mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: '1.15rem', letterSpacing: '-0.01em' }} className="mb-2">Quarterly Learnings</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 'var(--text-small)' }}>Technical instruction &amp; AI implementation.</p>
            </div>
            <nav className="flex gap-8 flex-wrap">
              {['Home', 'Services', 'About', 'Work', 'Blog', 'Contact'].map(link => (
                <span key={link} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 'var(--text-small)' }} className="cursor-default">
                  {link}
                </span>
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
