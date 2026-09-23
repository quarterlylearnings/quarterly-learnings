import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { Navigation } from './Navigation'

const meta: Meta<typeof Navigation> = {
  title: 'Layout/Navigation',
  component: Navigation,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof Navigation>

export const Desktop: Story = {
  args: { currentPath: '/services' },
}

export const Mobile: Story = {
  args: { currentPath: '/services' },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const MobileMenuOpen: Story = {
  args: { currentPath: '/services' },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }))
    const mobileMenu = document.getElementById('mobile-menu')
    expect(mobileMenu).toBeInTheDocument()
    expect(within(mobileMenu!).getByRole('link', { name: 'Home' })).toBeVisible()
  },
}

export const MobileMenuClose: Story = {
  args: { currentPath: '/services' },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Open menu' }))
    const mobileMenu = document.getElementById('mobile-menu')
    await userEvent.click(within(mobileMenu!).getByRole('link', { name: 'Home' }))
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument()
  },
}

export const TransparentScrolled: Story = {
  args: { currentPath: '/', transparent: true },
  decorators: [
    (Story) => (
      <div style={{ background: 'linear-gradient(to bottom, #0c1a11, #14281d)', minHeight: '200px' }}>
        <Story />
      </div>
    ),
  ],
}
