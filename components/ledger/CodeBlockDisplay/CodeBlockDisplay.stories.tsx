import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { CodeBlockDisplay } from './CodeBlockDisplay'

const meta: Meta<typeof CodeBlockDisplay> = {
  title: 'Ledger/CodeBlockDisplay',
  component: CodeBlockDisplay,
  parameters: { layout: 'padded' },
  argTypes: {
    language: {
      control: 'select',
      options: ['javascript', 'typescript', 'python', 'bash', 'html', 'css', 'json', 'text'],
    },
  },
}

export default meta
type Story = StoryObj<typeof CodeBlockDisplay>

export const Default: Story = {
  args: {
    language: 'javascript',
    code: `const summary = await ai.summarize(report)\nconsole.log(summary)`,
    caption: 'Summarize a report and print the result.',
  },
}

export const WithoutCaption: Story = {
  args: { language: 'bash', code: 'npm install openai' },
}

export const LongLine: Story = {
  args: {
    language: 'python',
    code: `prompt = "Summarize the following customer email in two sentences and list any dates, amounts or order numbers it mentions: " + email_body`,
    caption: 'Long lines scroll sideways instead of wrapping.',
  },
}

export const CopyFeedback: Story = {
  args: Default.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    Object.assign(navigator, { clipboard: { writeText: async () => {} } })
    await userEvent.click(canvas.getByRole('button', { name: /copy javascript code/i }))
    await expect(canvas.getByRole('button', { name: 'Copied' })).toBeVisible()
  },
}
