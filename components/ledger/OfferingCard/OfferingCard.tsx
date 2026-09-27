import { Body } from '@/components/typography/Body'
import { Caption } from '@/components/typography/Caption'
import { Heading } from '@/components/typography/Heading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/Card'
import { formatDate, formatSessionTime } from '@/lib/ledger/format'
import { formatPrice, salesWindow } from '@/payload/utilities/offerings'
import { firstSession, type PublicOffering } from '@/lib/ledger/offerings'

type OfferingCardProps = {
  offering: PublicOffering
  /** Evaluation time for the sales window; defaults to now. */
  now?: Date
}

/**
 * One purchasable run of a course on its course page: title, sales dates,
 * price and buy buttons. Checkout arrives with Stripe (DEV-95), so the buttons
 * are disabled for now.
 */
export function OfferingCard({ offering, now }: OfferingCardProps) {
  const sales = salesWindow(offering, now)
  const currency = offering.currency ?? 'usd'
  const headingId = `offering-${offering.id}`
  const first = firstSession(offering)
  const sessionCount = offering.sessions?.length ?? 0
  const salesNote =
    sales.status === 'not_open'
      ? `Sales open ${formatDate(sales.opensAt)}.`
      : sales.status === 'ended'
        ? `Sales closed ${formatDate(sales.closedAt)}.`
        : sales.closesAt
          ? `Sales close ${formatDate(sales.closesAt)}.`
          : null

  return (
    <Card as="section" aria-labelledby={headingId} className="flex flex-col">
      <CardHeader>
        {offering.salesState === 'unlisted' && (
          <Badge variant="subtle" size="sm" className="mb-3">
            Private link
          </Badge>
        )}
        <Heading level={4} as="h3">
          <span id={headingId}>{offering.title}</span>
        </Heading>
      </CardHeader>
      <CardBody>
        {offering.price != null && (
          <p className="font-serif text-h2 text-tertiary">{formatPrice(offering.price, currency)}</p>
        )}
        {offering.seatPrice != null && (
          <Caption as="p" className="mt-1">
            Team seats {formatPrice(offering.seatPrice, currency)} each
          </Caption>
        )}
        {first && (
          <Body className="mt-4">
            {sessionCount === 1 ? 'Live session' : `${sessionCount} live sessions, starting`}{' '}
            {formatSessionTime(first.startsAt, first.endsAt, first.timezone)}
          </Body>
        )}
        {salesNote && <Body className="mt-4">{salesNote}</Body>}
      </CardBody>
      <CardFooter className="mt-auto flex flex-wrap gap-3">
        <Button disabled>Buy a seat</Button>
        {offering.seatPrice != null && (
          <Button variant="secondary" disabled>
            Buy for a team
          </Button>
        )}
        {sales.status === 'open' && <Caption as="p" className="w-full">Online checkout opens soon.</Caption>}
      </CardFooter>
    </Card>
  )
}
