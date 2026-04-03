import type { Meta, StoryObj } from '@storybook/react'
import { FileQuestion, SearchX, Inbox } from 'lucide-react'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof EmptyState>

export const Default: Story = {
  args: {
    icon: Inbox,
    heading: 'Nothing here yet',
    description: 'Check back soon — new content is on the way.',
  },
}

export const WithCTA: Story = {
  args: {
    icon: FileQuestion,
    heading: 'No case studies found',
    description: "We haven't published any work in this category yet.",
    cta: { label: 'Browse all work', onClick: () => {} },
  },
}

export const SearchEmpty: Story = {
  args: {
    icon: SearchX,
    heading: 'No results',
    description: 'Try adjusting your search terms or browsing all posts.',
    cta: { label: 'Clear search', onClick: () => {} },
  },
}

export const AllIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-[480px]">
      <EmptyState icon={Inbox} heading="Inbox empty" description="You're all caught up." />
      <EmptyState icon={SearchX} heading="No results" description="Try a different search." />
      <EmptyState
        icon={FileQuestion}
        heading="Nothing here"
        description="This section is coming soon."
        cta={{ label: 'Go home', onClick: () => {} }}
      />
    </div>
  ),
}
