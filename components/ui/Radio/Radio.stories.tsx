import type { Meta, StoryObj } from '@storybook/react'
import { Radio, RadioGroup } from './Radio'

const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Radio>

export const Default: Story = {
  args: { label: 'Technical Training', name: 'service' },
}

export const WithGroup: Story = {
  render: () => (
    <RadioGroup legend="Which service are you interested in?">
      <Radio name="service" value="training" label="Technical Training" defaultChecked />
      <Radio name="service" value="ai" label="AI Implementation" />
      <Radio name="service" value="both" label="Both" />
    </RadioGroup>
  ),
}

export const DisabledOptions: Story = {
  render: () => (
    <RadioGroup legend="Availability">
      <Radio name="avail" value="yes" label="Available now" defaultChecked />
      <Radio name="avail" value="soon" label="Available soon" />
      <Radio name="avail" value="no" label="Not available" disabled />
    </RadioGroup>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Radio name="single" value="a" label="Unchecked" />
      <Radio name="single2" value="b" label="Checked" defaultChecked />
      <Radio name="single3" value="c" label="Disabled" disabled />
      <Radio name="single4" value="d" label="Disabled + checked" disabled defaultChecked />
    </div>
  ),
}
