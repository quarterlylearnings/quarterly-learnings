import type { Meta, StoryObj } from '@storybook/react'
import { Hero } from './Hero'

const meta: Meta<typeof Hero> = {
  title: 'Components/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Hero>

export const Centered: Story = {
  args: {
    eyebrow: 'Technical Instruction & AI Implementation',
    headline: 'Build the skills your team needs.',
    subtext: 'Quarterly Learnings delivers expert-led technical training for teams and practical AI implementation for small businesses.',
    primaryCta: { label: 'Get in touch', href: '/contact' },
    secondaryCta: { label: 'See our work', href: '/work' },
    variant: 'centered',
  },
}

export const Split: Story = {
  args: {
    eyebrow: 'Technical Instruction & AI Implementation',
    headline: 'Build the skills your team needs.',
    subtext: 'Quarterly Learnings delivers expert-led technical training for teams and practical AI implementation for small businesses.',
    primaryCta: { label: 'Get in touch', href: '/contact' },
    secondaryCta: { label: 'See our work', href: '/work' },
    variant: 'split',
    image: {
      src: '/placeholder-logo.svg',
      alt: 'An instructor leading a technical workshop with students engaged in the foreground.',
    },
  },
}

export const NoEyebrow: Story = {
  args: {
    headline: 'Build the skills your team needs.',
    subtext: 'Quarterly Learnings delivers expert-led technical training for teams and practical AI implementation for small businesses.',
    primaryCta: { label: 'Get in touch', href: '/contact' },
    variant: 'centered',
  },
}

export const Mobile: Story = {
  args: {
    eyebrow: 'Technical Instruction & AI Implementation',
    headline: 'Build the skills your team needs.',
    subtext: 'Quarterly Learnings delivers expert-led technical training for teams and practical AI implementation for small businesses.',
    primaryCta: { label: 'Get in touch', href: '/contact' },
    secondaryCta: { label: 'See our work', href: '/work' },
    variant: 'split',
    image: {
      src: '/placeholder-logo.svg',
      alt: 'An instructor leading a technical workshop with students engaged in the foreground.',
    },
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
