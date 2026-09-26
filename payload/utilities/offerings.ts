export const SALES_STATES = ['draft', 'unlisted', 'on_sale', 'closed'] as const
export type SalesState = (typeof SALES_STATES)[number]

type SalesWindowFields = { salesOpenAt?: string | null; salesCloseAt?: string | null }

export type SalesWindow =
  | { status: 'open'; closesAt: Date | null }
  | { status: 'not_open'; opensAt: Date }
  | { status: 'ended'; closedAt: Date }

/**
 * Where `now` falls in an offering's sales window (PRD §3.2 R4). Either bound
 * may be empty: no `salesOpenAt` means open already, no `salesCloseAt` means it
 * never closes. The open bound is inclusive, the close bound exclusive.
 */
export function salesWindow({ salesOpenAt, salesCloseAt }: SalesWindowFields, now = new Date()): SalesWindow {
  const opensAt = salesOpenAt ? new Date(salesOpenAt) : null
  const closesAt = salesCloseAt ? new Date(salesCloseAt) : null
  if (opensAt && now < opensAt) return { status: 'not_open', opensAt }
  if (closesAt && now >= closesAt) return { status: 'ended', closedAt: closesAt }
  return { status: 'open', closesAt }
}

/** 49900, 'usd' -> "$499"; 4950, 'usd' -> "$49.50" */
export function formatPrice(cents: number, currency: string): string {
  const whole = cents % 100 === 0
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(cents / 100)
}
