import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'outline', 'subtle'] },
    size: { control: 'select', options: ['sm', 'md'] },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: { label: 'Badge' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default" label="Default" />
      <Badge variant="outline" label="Outline" />
      <Badge variant="subtle" label="Subtle" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="sm" label="Small" />
      <Badge size="md" label="Medium" />
    </div>
  ),
}

export const VariantsSizes: Story = {
  name: 'All Variants × Sizes',
  render: () => (
    <div className="flex flex-col gap-4">
      {(['default', 'outline', 'subtle'] as const).map(variant => (
        <div key={variant} className="flex items-center gap-3">
          <Badge variant={variant} size="sm" label={`${variant} sm`} />
          <Badge variant={variant} size="md" label={`${variant} md`} />
        </div>
      ))}
    </div>
  ),
}

export const InContext: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <span className="font-sans text-body text-tertiary">AI Implementation</span>
      <Badge variant="subtle" size="sm" label="New" />
    </div>
  ),
}
