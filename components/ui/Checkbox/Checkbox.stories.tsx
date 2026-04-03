import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: { label: 'I agree to the terms and conditions' },
}

export const Checked: Story = {
  args: { label: 'Subscribe to newsletter', defaultChecked: true },
}

export const Disabled: Story = {
  args: { label: 'This option is unavailable', disabled: true },
}

export const DisabledChecked: Story = {
  args: { label: 'Always enabled (locked)', disabled: true, defaultChecked: true },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Disabled" disabled />
      <Checkbox label="Disabled + checked" disabled defaultChecked />
    </div>
  ),
}
