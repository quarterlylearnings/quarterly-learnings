import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: { children: 'Get in touch', variant: 'primary', size: 'md' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary" size="sm" loading>Small</Button>
      <Button variant="primary" size="md" loading>Sending…</Button>
      <Button variant="secondary" size="lg" loading>Submit application</Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary" disabled>Primary</Button>
      <Button variant="secondary" disabled>Secondary</Button>
      <Button variant="ghost" disabled>Ghost</Button>
    </div>
  ),
}

export const AsAnchor: Story = {
  args: { as: 'a', href: '#', children: 'Learn more' },
}

export const LoadingLocksWidth: Story = {
  name: 'Loading — width is locked',
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <div className="flex items-center gap-4">
        <Button variant="primary" size="md">Send message</Button>
        <Button variant="primary" size="md" loading>Send message</Button>
      </div>
      <p className="font-sans text-small text-neutral">Both buttons above are the same width.</p>
    </div>
  ),
}

export const DisabledNotInteractive: Story = {
  name: 'Disabled — not interactive',
  args: { children: 'Disabled button', disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    expect(button).toBeDisabled()
    await userEvent.click(button, { pointerEventsCheck: 0 })
  },
}
