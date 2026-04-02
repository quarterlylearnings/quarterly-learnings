import type { Meta, StoryObj } from '@storybook/react'

// ── Color palette ────────────────────────────────────────────────────────────

const colors = [
  { name: 'Primary', token: '--color-primary', hex: '#80A1D4', role: 'Interactive elements, links, buttons, focus rings' },
  { name: 'Secondary', token: '--color-secondary', hex: '#355834', role: 'Section accents, supporting UI elements' },
  { name: 'Tertiary', token: '--color-tertiary', hex: '#14281D', role: 'Dark backgrounds, hero surfaces' },
  { name: 'Accent', token: '--color-accent', hex: '#FFDB00', role: 'Key CTAs, highlights — use sparingly' },
  { name: 'Neutral', token: '--color-neutral', hex: '#6E633D', role: 'Body text, borders, subdued labels' },
  { name: 'Error', token: '--color-error', hex: '#C0392B', role: 'Form errors, destructive feedback' },
]

// ── Type scale ───────────────────────────────────────────────────────────────

const typeScale = [
  { name: 'display', label: 'Display', size: '3.5rem', font: 'Lora', specimen: 'Build the skills your team needs.' },
  { name: 'h1', label: 'H1', size: '2.75rem', font: 'Lora', specimen: 'Technical Training for Teams' },
  { name: 'h2', label: 'H2', size: '2rem', font: 'Lora', specimen: "Who we've worked with." },
  { name: 'h3', label: 'H3', size: '1.5rem', font: 'Red Hat Display', specimen: 'For teams that need to learn fast.' },
  { name: 'h4', label: 'H4', size: '1.125rem', font: 'Red Hat Display', specimen: 'Technical Instruction & AI Implementation' },
  { name: 'body', label: 'Body', size: '1rem', font: 'Red Hat Display', specimen: 'Quarterly Learnings delivers focused technical training for teams and practical AI implementation for small businesses.' },
  { name: 'small', label: 'Small', size: '0.875rem', font: 'Red Hat Display', specimen: 'Captions, supporting text, supplementary information.' },
  { name: 'label', label: 'Label', size: '0.75rem', font: 'Red Hat Display', specimen: 'UI LABELS · TAGS · METADATA' },
]

// ── Component ────────────────────────────────────────────────────────────────

function DesignTokens() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', padding: '48px', maxWidth: '960px' }}>

      {/* Color Palette */}
      <h2
        data-testid="color-system-heading"
        style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', color: 'var(--color-tertiary)', marginBottom: '32px' }}
      >
        Color System
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', marginBottom: '64px' }}>
        {colors.map(({ name, token, hex, role }) => (
          <div key={token}>
            <div
              data-testid={`swatch-${name.toLowerCase()}`}
              style={{
                backgroundColor: `var(${token})`,
                borderRadius: '8px',
                aspectRatio: '1',
                marginBottom: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
            />
            <p style={{ fontSize: 'var(--text-h4)', color: 'var(--color-tertiary)', fontWeight: 600, margin: '0 0 2px' }}>{name}</p>
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', fontFamily: 'monospace', margin: '0 0 4px' }}>{hex}</p>
            <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', lineHeight: 1.4, margin: 0 }}>{role}</p>
          </div>
        ))}
      </div>

      {/* Typography Scale */}
      <h2
        data-testid="typography-scale-heading"
        style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)', color: 'var(--color-tertiary)', marginBottom: '32px' }}
      >
        Typography Scale
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {typeScale.map(({ name, label, size, font, specimen }) => (
          <div
            key={name}
            style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'baseline',
              paddingBottom: '32px',
              borderBottom: '1px solid rgba(110,99,61,0.15)',
            }}
          >
            <div style={{ flexShrink: 0, width: '80px' }}>
              <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 2px' }}>{label}</p>
              <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', fontFamily: 'monospace', margin: '0 0 2px' }}>{size}</p>
              <p style={{ fontSize: 'var(--text-label)', color: 'var(--color-neutral)', margin: 0 }}>{font}</p>
            </div>
            <p
              data-testid={`type-${name}`}
              style={{
                fontFamily: ['display', 'h1', 'h2'].includes(name) ? 'var(--font-serif)' : 'var(--font-sans)',
                fontSize: `var(--text-${name})`,
                color: 'var(--color-tertiary)',
                lineHeight: name === 'display' ? 1.1 : name === 'h1' ? 1.15 : 1.6,
                fontWeight: ['display', 'h1', 'h2'].includes(name) ? 700 : ['h3', 'h4'].includes(name) ? 600 : 400,
                margin: 0,
              }}
            >
              {specimen}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Story config ─────────────────────────────────────────────────────────────

const meta: Meta<typeof DesignTokens> = {
  title: 'Design System/Tokens',
  component: DesignTokens,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'light' },
  },
}

export default meta
type Story = StoryObj<typeof DesignTokens>

export const AllTokens: Story = {
  name: 'Color + Typography',
}

export const ColorPalette: Story = {
  name: 'Color Palette',
  render: () => (
    <div style={{ fontFamily: 'var(--font-sans)', padding: '48px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px', maxWidth: '960px' }}>
        {colors.map(({ name, token, hex, role }) => (
          <div key={token}>
            <div
              data-testid={`swatch-${name.toLowerCase()}`}
              style={{
                backgroundColor: `var(${token})`,
                borderRadius: '8px',
                aspectRatio: '1',
                marginBottom: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
              }}
            />
            <p style={{ fontSize: '0.75rem', fontWeight: 600, margin: '0 0 2px', color: '#14281D' }}>{name}</p>
            <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', margin: 0, color: '#6E633D' }}>{hex}</p>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const TypographyScale: Story = {
  name: 'Typography Scale',
  render: () => (
    <div style={{ fontFamily: 'var(--font-sans)', padding: '48px', maxWidth: '960px' }}>
      {typeScale.map(({ name, size, font, specimen }) => (
        <div
          key={name}
          style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid rgba(110,99,61,0.15)' }}
        >
          <p style={{ fontSize: '0.75rem', color: '#6E633D', margin: '0 0 4px' }}>
            {name} · {size} · {font}
          </p>
          <p
            style={{
              fontFamily: ['display', 'h1', 'h2'].includes(name) ? 'var(--font-serif)' : 'var(--font-sans)',
              fontSize: `var(--text-${name})`,
              color: 'var(--color-tertiary)',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {specimen}
          </p>
        </div>
      ))}
    </div>
  ),
}
