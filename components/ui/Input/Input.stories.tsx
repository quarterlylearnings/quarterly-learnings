import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: { label: 'Your name', placeholder: 'e.g. Jane Smith' },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const Required: Story = {
  args: { label: 'Email address', placeholder: 'you@company.com', required: true, type: 'email' },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const WithError: Story = {
  args: {
    label: 'Email address',
    placeholder: 'you@company.com',
    type: 'email',
    defaultValue: 'not-an-email',
    error: 'Please enter a valid email address.',
  },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const Disabled: Story = {
  args: { label: 'Organisation', defaultValue: 'Quarterly Learnings', disabled: true },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const AllStates: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-6">
      <Input label="Default" placeholder="Placeholder text" />
      <Input label="Required" placeholder="Required field" required />
      <Input label="With error" defaultValue="bad input" error="This field is required." />
      <Input label="Disabled" defaultValue="Locked value" disabled />
    </div>
  ),
}
