import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  argTypes: {
    rows: { control: 'number' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  args: { label: 'Message', placeholder: 'Tell us about your project…', rows: 4 },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const WithError: Story = {
  args: {
    label: 'Message',
    defaultValue: 'hi',
    error: 'Message must be at least 20 characters.',
    rows: 4,
  },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const Disabled: Story = {
  args: { label: 'Notes', defaultValue: 'Read-only notes here.', disabled: true, rows: 3 },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const AllStates: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-6">
      <Textarea label="Default" placeholder="Placeholder…" rows={3} />
      <Textarea label="Required" placeholder="Required…" required rows={3} />
      <Textarea label="Error" defaultValue="short" error="Too short — please elaborate." rows={3} />
      <Textarea label="Disabled" defaultValue="Locked content." disabled rows={3} />
    </div>
  ),
}
