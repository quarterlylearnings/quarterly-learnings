import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { Body } from '@/components/typography/Body'
import { Link } from '@/components/ui/Link'
import { Divider } from '@/components/ui/Divider'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { BOOKING_URL } from '@/data/booking'

// Destination after a successful contact form submission (see ContactForm)
export const metadata: Metadata = {
  title: 'Message sent',
  robots: { index: false },
}

export default function SuccessPage() {
  return (
    <>
      <PageHeader
        eyebrow="Message sent"
        headline="Thanks for reaching out."
        subtext="We'll get back to you within 1–2 business days."
      />
      <Section>
        <Container className="max-w-2xl mx-auto">
          <Body className="mb-3">Want to talk sooner? Book a free 30-minute intro call.</Body>
          <Link variant="standalone" href={BOOKING_URL} external>
            Book a 30-minute call
          </Link>
          <Divider variant="line" className="my-10" />
          <div className="flex flex-col gap-4">
            <Link variant="standalone" href="/work">
              See our work
            </Link>
            <Link variant="standalone" href="/">
              Back to home
            </Link>
          </div>
        </Container>
      </Section>
    </>
  )
}
