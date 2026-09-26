import type { Meta, StoryObj } from '@storybook/react'
import { OfferingCard } from './OfferingCard'

// Fixed clock so the sales-window states don't drift.
const now = new Date('2026-10-01T12:00:00Z')

const base = {
  id: 'offering-1',
  title: 'Open Cohort',
  salesState: 'on_sale' as const,
  price: 49900,
  seatPrice: null,
  currency: 'usd' as const,
  salesOpenAt: '2026-09-20T12:00:00Z',
  salesCloseAt: '2026-10-31T12:00:00Z',
}

const meta: Meta<typeof OfferingCard> = {
  title: 'Ledger/OfferingCard',
  component: OfferingCard,
  parameters: { layout: 'padded' },
  args: { now },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
}

export default meta
type Story = StoryObj<typeof OfferingCard>

export const OnSale: Story = { args: { offering: base } }

export const WithTeamSeats: Story = { args: { offering: { ...base, seatPrice: 39900 } } }

export const NoCloseDate: Story = { args: { offering: { ...base, salesCloseAt: null } } }

export const NotYetOpen: Story = {
  args: { offering: { ...base, title: 'Upcoming Cohort', salesOpenAt: '2026-10-15T12:00:00Z' } },
}

export const SalesEnded: Story = {
  args: { offering: { ...base, title: 'Sold Through Cohort', salesCloseAt: '2026-09-28T12:00:00Z' } },
}

export const Unlisted: Story = {
  args: { offering: { ...base, title: 'Early List Cohort', salesState: 'unlisted', price: 39900 } },
}
