import type { Meta, StoryObj } from '@storybook/react'
import { BlogCard } from './BlogCard'

const meta: Meta<typeof BlogCard> = {
  title: 'Blog/BlogCard',
  component: BlogCard,
  parameters: { layout: 'centered' },
}
export default meta
type Story = StoryObj<typeof BlogCard>

export const Default: Story = {
  render: () => (
    <div className="w-80">
      <BlogCard
        id="welcome-to-the-blog"
        title="Welcome to the blog"
        dateCreated="2023-03-12"
        excerpt="A short introduction to what we'll be writing about here."
      />
    </div>
  ),
}

export const WithDate: Story = {
  render: () => (
    <div className="w-80">
      <BlogCard
        id="some-post"
        title="Five things I learned training engineers"
        date="2024-01-15"
        excerpt="After running dozens of workshops, a few patterns keep showing up."
      />
    </div>
  ),
}

export const NoExcerpt: Story = {
  render: () => (
    <div className="w-80">
      <BlogCard id="no-excerpt" title="A post with no excerpt" date="2024-06-01" />
    </div>
  ),
}
