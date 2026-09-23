import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import { Footer } from './Footer'

const meta: Meta<typeof Footer> = {
  title: 'Layout/Footer',
  component: Footer,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Footer>

export const Default: Story = {}

export const Links: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Nav links
    expect(canvas.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(canvas.getByRole('link', { name: 'Services' })).toBeInTheDocument()
    expect(canvas.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(canvas.getByRole('link', { name: 'Work' })).toBeInTheDocument()
    expect(canvas.getByRole('link', { name: 'Blog' })).toBeInTheDocument()
    expect(canvas.getByRole('link', { name: 'Contact' })).toBeInTheDocument()

    // Social links
    expect(canvas.getByRole('link', { name: 'Email' })).toBeInTheDocument()
    expect(canvas.getByRole('link', { name: 'YouTube' })).toBeInTheDocument()
    expect(canvas.getByRole('link', { name: 'TikTok' })).toBeInTheDocument()
    expect(canvas.getByRole('link', { name: 'Podcast' })).toBeInTheDocument()
  },
}
