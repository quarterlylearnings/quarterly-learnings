import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['logo', 'initials'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

export const LogoVariant: Story = {
  args: {
    variant: 'logo',
    src: '/placeholder-logo.svg',
    alt: 'Acme Corp',
    size: 'md',
  },
}

export const InitialsVariant: Story = {
  args: { variant: 'initials', name: 'Quarterly Learnings', size: 'md' },
}

export const Fallback: Story = {
  name: 'Fallback to initials on image error',
  args: {
    variant: 'logo',
    src: '/nonexistent-image.png',
    alt: 'Client',
    name: 'Acme Corp',
    size: 'md',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar variant="initials" name="Brandon Campbell" size="sm" />
      <Avatar variant="initials" name="Brandon Campbell" size="md" />
      <Avatar variant="initials" name="Brandon Campbell" size="lg" />
    </div>
  ),
}

export const BothVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          variant="logo"
          src="/placeholder-logo.svg"
          alt="Quarterly Learnings"
          size="lg"
        />
        <span className="font-sans text-small text-neutral">Logo</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Avatar variant="initials" name="Quarterly Learnings" size="lg" />
        <span className="font-sans text-small text-neutral">Initials</span>
      </div>
    </div>
  ),
}
