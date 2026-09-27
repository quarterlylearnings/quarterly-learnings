import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { CompleteLessonButton } from './CompleteLessonButton'

const meta: Meta<typeof CompleteLessonButton> = {
  title: 'Ledger/CompleteLessonButton',
  component: CompleteLessonButton,
  parameters: { layout: 'centered' },
  // Stands in for the server action, with a short delay to show the pending state.
  args: {
    complete: () => new Promise((resolve) => setTimeout(() => resolve({ completed: true }), 400)),
  },
}

export default meta
type Story = StoryObj<typeof CompleteLessonButton>

export const NotCompleted: Story = {}

export const Completed: Story = { args: { initiallyCompleted: true } }

export const Failed: Story = {
  args: { complete: async () => ({ error: 'Enroll in this course to track your progress.' }) },
}

export const MarkComplete: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Mark complete' }))
    await expect(await canvas.findByRole('status')).toHaveTextContent('Completed')
  },
}
