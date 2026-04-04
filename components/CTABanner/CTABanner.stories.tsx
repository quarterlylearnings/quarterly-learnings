import type { Meta, StoryObj } from '@storybook/react'
import { CTABanner } from './CTABanner'

const meta: Meta<typeof CTABanner> = {
  title: 'Components/CTABanner',
  component: CTABanner,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof CTABanner>

export const Default: Story = {
  args: {
    headline: 'Ready to work together?',
    cta: { label: 'Get in touch', href: '/contact' },
  },
}

export const WithSubtext: Story = {
  args: {
    headline: 'Ready to work together?',
    subtext: "Whether you're looking to upskill your team or explore what AI can do for your business, we'd love to hear from you.",
    cta: { label: 'Get in touch', href: '/contact' },
  },
}
