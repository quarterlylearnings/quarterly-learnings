import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import { Card } from './Card'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'flat', 'interactive'] },
  },
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card variant="default" className="w-80">
      <Card.Header>
        <h3 className="font-serif text-h3 text-tertiary">Technical Training</h3>
      </Card.Header>
      <Card.Body>
        <p className="font-sans text-body text-neutral">
          Focused skill-building for engineering teams who need to move fast.
        </p>
      </Card.Body>
    </Card>
  ),
}

export const Flat: Story = {
  render: () => (
    <Card variant="flat" className="w-80">
      <Card.Body>
        <p className="font-sans text-body text-tertiary">
          A flat card for subdued surfaces — no shadow, no border.
        </p>
      </Card.Body>
    </Card>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Card
      variant="interactive"
      className="w-80"
      onClick={() => alert('Card clicked')}
    >
      <Card.Header>
        <h3 className="font-serif text-h3 text-tertiary">AI Implementation</h3>
      </Card.Header>
      <Card.Body>
        <p className="font-sans text-body text-neutral">
          Practical AI for small businesses. Click me — I&apos;m fully interactive.
        </p>
      </Card.Body>
    </Card>
  ),
}

export const WithMedia: Story = {
  render: () => (
    <Card variant="default" className="w-80">
      <Card.Media>
        <div className="h-40 bg-primary/20 flex items-center justify-center">
          <span className="font-sans text-small text-primary">Media slot</span>
        </div>
      </Card.Media>
      <Card.Header>
        <h3 className="font-serif text-h3 text-tertiary">Case Study</h3>
      </Card.Header>
      <Card.Body>
        <p className="font-sans text-body text-neutral">
          How we helped a fintech team ship a new onboarding flow in six weeks.
        </p>
      </Card.Body>
      <Card.Footer>
        <span className="font-sans text-small text-neutral">Fintech · AI Implementation</span>
      </Card.Footer>
    </Card>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-80">
      <Card variant="default">
        <Card.Body>
          <p className="font-sans text-body text-tertiary font-medium">Default</p>
          <p className="font-sans text-small text-neutral mt-1">Bordered with shadow on hover</p>
        </Card.Body>
      </Card>
      <Card variant="flat">
        <Card.Body>
          <p className="font-sans text-body text-tertiary font-medium">Flat</p>
          <p className="font-sans text-small text-neutral mt-1">No shadow, tinted background</p>
        </Card.Body>
      </Card>
      <Card variant="interactive" onClick={() => {}}>
        <Card.Body>
          <p className="font-sans text-body text-tertiary font-medium">Interactive</p>
          <p className="font-sans text-small text-neutral mt-1">Clickable, keyboard accessible</p>
        </Card.Body>
      </Card>
    </div>
  ),
}

export const KeyboardAccessible: Story = {
  name: 'Interactive — keyboard accessible',
  render: () => (
    <Card
      variant="interactive"
      className="w-80"
      onClick={() => {}}
    >
      <Card.Body>
        <p className="font-sans text-body text-tertiary">Tab to focus, Enter or Space to activate.</p>
      </Card.Body>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByRole('button')
    await userEvent.tab()
    expect(card).toHaveFocus()
  },
}

export const Narrow: Story = {
  name: 'Readable at 320px',
  render: () => (
    <Card variant="default" className="w-[320px]">
      <Card.Header>
        <h3 className="font-serif text-h3 text-tertiary">Technical Training</h3>
      </Card.Header>
      <Card.Body>
        <p className="font-sans text-body text-neutral">
          Focused skill-building for engineering teams who need to move fast and build real capability.
        </p>
      </Card.Body>
    </Card>
  ),
}
