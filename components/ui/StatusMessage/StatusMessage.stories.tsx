import type { Meta, StoryObj } from '@storybook/react'
import { StatusMessage } from './StatusMessage'

const meta: Meta<typeof StatusMessage> = {
  title: 'UI/StatusMessage',
  component: StatusMessage,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['success', 'error', 'info'] },
  },
}

export default meta
type Story = StoryObj<typeof StatusMessage>

export const Success: Story = {
  args: {
    variant: 'success',
    message: "Your message has been sent. We'll be in touch within one business day.",
  },
  decorators: [Story => <div className="w-96"><Story /></div>],
}

export const Error: Story = {
  args: {
    variant: 'error',
    message: 'Something went wrong. Please try again or email us directly.',
  },
  decorators: [Story => <div className="w-96"><Story /></div>],
}

export const Info: Story = {
  args: {
    variant: 'info',
    message: 'This form is currently unavailable. Please check back soon.',
  },
  decorators: [Story => <div className="w-96"><Story /></div>],
}

export const AllVariants: Story = {
  render: () => (
    <div className="w-96 flex flex-col gap-4">
      <StatusMessage
        variant="success"
        message="Your message has been sent successfully."
      />
      <StatusMessage
        variant="error"
        message="There was an error processing your request."
      />
      <StatusMessage
        variant="info"
        message="This section is currently under construction."
      />
    </div>
  ),
}
