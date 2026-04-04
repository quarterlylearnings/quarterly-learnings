import type { Meta, StoryObj } from '@storybook/react'
import { expect, within } from 'storybook/test'
import { Testimonial, TestimonialContainer } from './TestimonialBlock'

const meta: Meta<typeof Testimonial> = {
  title: 'Components/TestimonialBlock',
  component: Testimonial,
  parameters: { layout: 'padded' },
}

export default meta
type Story = StoryObj<typeof Testimonial>

export const Single: Story = {
  args: {
    quote: "The training Quarterly Learnings delivered transformed how our team thinks about data. Clear, practical, and immediately applicable.",
    name: 'Jamie Chen',
    role: 'Engineering Manager',
    company: 'Acme Corp',
  },
}

export const ContainerWithItems: StoryObj<typeof TestimonialContainer> = {
  render: () => (
    <TestimonialContainer
      items={[
        {
          quote: "The training Quarterly Learnings delivered transformed how our team thinks about data. Clear, practical, and immediately applicable.",
          name: 'Jamie Chen',
          role: 'Engineering Manager',
          company: 'Acme Corp',
        },
        {
          quote: "We had a vague idea that AI could help our operations. After working with Quarterly Learnings, we had a working prototype in three weeks.",
          name: 'Marcus Webb',
          role: 'Owner',
          company: 'Webb & Associates',
        },
      ]}
    />
  ),
}

export const ContainerEmpty: StoryObj<typeof TestimonialContainer> = {
  render: () => <TestimonialContainer items={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    expect(canvas.queryByRole('figure')).toBeNull()
  },
}
