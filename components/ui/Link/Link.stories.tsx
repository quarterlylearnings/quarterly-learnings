import type { Meta, StoryObj } from '@storybook/react'
import { Link } from './Link'

const meta: Meta<typeof Link> = {
  title: 'UI/Link',
  component: Link,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['inline', 'standalone', 'nav'] },
    external: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Link>

export const Inline: Story = {
  args: { href: '#', variant: 'inline', children: 'Read our case studies' },
}

export const Standalone: Story = {
  args: { href: '#', variant: 'standalone', children: 'View all services' },
}

export const Nav: Story = {
  args: { href: '#', variant: 'nav', children: 'Services' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-6 items-start">
      <p className="font-sans text-body text-tertiary">
        We help teams build skills with{' '}
        <Link href="#" variant="inline">practical technical training</Link>
        {' '}that sticks.
      </p>
      <Link href="#" variant="standalone">Explore our approach</Link>
      <nav className="flex gap-6">
        <Link href="#" variant="nav">Services</Link>
        <Link href="#" variant="nav">Work</Link>
        <Link href="#" variant="nav">Blog</Link>
      </nav>
    </div>
  ),
}

export const External: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <Link href="https://example.com" variant="standalone" external>
        View the case study
      </Link>
      <Link href="https://example.com" variant="inline" external>
        published research
      </Link>
    </div>
  ),
}
