import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta: Meta<typeof Divider> = {
  title: 'UI/Divider',
  component: Divider,
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'select', options: ['line', 'labeled'] },
  },
}

export default meta
type Story = StoryObj<typeof Divider>

export const Line: Story = {
  args: { variant: 'line' },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export const Labeled: Story = {
  args: { variant: 'labeled', label: 'or' },
  decorators: [
    Story => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
}

export const BothVariants: Story = {
  render: () => (
    <div className="w-96 flex flex-col gap-8">
      <div>
        <p className="font-sans text-small text-neutral mb-4">Line variant</p>
        <Divider variant="line" />
      </div>
      <div>
        <p className="font-sans text-small text-neutral mb-4">Labeled variant</p>
        <Divider variant="labeled" label="Services" />
      </div>
    </div>
  ),
}

export const InContent: Story = {
  render: () => (
    <div className="w-96 flex flex-col gap-4">
      <p className="font-sans text-body text-tertiary">
        Technical training for teams who need to move fast and build real capability.
      </p>
      <Divider variant="labeled" label="and" />
      <p className="font-sans text-body text-tertiary">
        Practical AI implementation for small businesses ready to grow.
      </p>
    </div>
  ),
}
