import { PageHeader } from '@/components/PageHeader/PageHeader'
import { ContactForm } from '@/components/ContactForm/ContactForm'
import { Body } from '@/components/typography/Body'
import { Link } from '@/components/ui/Link'
import { Divider } from '@/components/ui/Divider'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        headline="Start a conversation"
        subtext="We'll get back to you within 1–2 business days."
      />
      <Section>
        <Container className="max-w-2xl mx-auto">
          <div className="mb-10">
            <Body className="mb-3">Prefer to talk first? Book a free 30-minute intro call.</Body>
            {/* TODO: replace with real Google Calendar appointment link */}
            <Link
              variant="standalone"
              href="https://calendar.google.com/calendar/appointments"
              external
            >
              Book a 30-minute call
            </Link>
          </div>
          <Divider variant="line" className="mb-10" />
          <ContactForm />
        </Container>
      </Section>
    </>
  )
}
