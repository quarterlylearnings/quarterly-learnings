import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const serviceOptions = [
  { value: 'training', label: 'Technical Training' },
  { value: 'ai', label: 'AI Implementation' },
  { value: 'both', label: 'Both' },
]

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
  args: {
    label: 'Service interested in',
    options: serviceOptions,
    placeholder: 'Select a service…',
  },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const WithError: Story = {
  args: {
    label: 'Service interested in',
    options: serviceOptions,
    placeholder: 'Select a service…',
    error: 'Please select a service.',
  },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const Disabled: Story = {
  args: {
    label: 'Region',
    options: [{ value: 'au', label: 'Australia' }],
    defaultValue: 'au',
    disabled: true,
  },
  decorators: [Story => <div className="w-80"><Story /></div>],
}

export const AllStates: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-6">
      <Select label="Default" options={serviceOptions} placeholder="Choose…" />
      <Select label="Required" options={serviceOptions} placeholder="Choose…" required />
      <Select label="Error" options={serviceOptions} error="Selection required." />
      <Select label="Disabled" options={serviceOptions} defaultValue="training" disabled />
    </div>
  ),
}
