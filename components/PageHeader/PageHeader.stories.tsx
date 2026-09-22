import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './PageHeader'

const meta: Meta<typeof PageHeader> = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof PageHeader>

export const Default: Story = {
  args: {
    headline: 'Services',
  },
}

export const WithEyebrow: Story = {
  args: {
    eyebrow: 'What we do',
    headline: 'Services',
  },
}

export const WithSubtext: Story = {
  args: {
    eyebrow: 'What we do',
    headline: 'Services',
    subtext: 'Technical training for teams and AI implementation for small businesses.',
  },
}
