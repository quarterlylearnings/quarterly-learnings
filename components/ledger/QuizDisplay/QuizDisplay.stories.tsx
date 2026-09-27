import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { QuizDisplay, type QuizDisplayCheck } from './QuizDisplay'

const options = ['Approving the budget', 'Drafting a meeting summary', 'Signing a contract']
const explanation = 'A draft summary is easy to check and cheap to get wrong.'

// Stands in for the server action: grades against a known answer.
const mockCheck = async (selectedIndex: number): Promise<QuizDisplayCheck> => ({
  result: { selectedIndex, correct: selectedIndex === 1, correctIndex: 1, explanation },
})

const meta: Meta<typeof QuizDisplay> = {
  title: 'Ledger/QuizDisplay',
  component: QuizDisplay,
  parameters: { layout: 'padded' },
  args: {
    question: 'Which task is the best first job for an AI assistant?',
    options,
    check: mockCheck,
  },
}

export default meta
type Story = StoryObj<typeof QuizDisplay>

export const Unanswered: Story = {}

export const AnsweredCorrectly: Story = {
  args: { initialResult: { selectedIndex: 1, correct: true, correctIndex: 1, explanation } },
}

export const AnsweredWrong: Story = {
  args: { initialResult: { selectedIndex: 0, correct: false, correctIndex: 1, explanation } },
}

export const ServerError: Story = {
  args: { check: async () => ({ error: 'Enroll in this course to answer its questions.' }) },
}

export const CheckAndRetry: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const check = canvas.getByRole('button', { name: 'Check answer' })
    await expect(check).toBeDisabled()

    await userEvent.click(canvas.getByRole('radio', { name: options[0] }))
    await userEvent.click(check)
    await expect(await canvas.findByText('Not quite')).toBeVisible()
    await expect(canvas.getByText('Your answer')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }))
    await userEvent.click(canvas.getByRole('radio', { name: options[1] }))
    await userEvent.click(canvas.getByRole('button', { name: 'Check answer' }))
    await expect(await canvas.findByText('Correct')).toBeVisible()
  },
}
