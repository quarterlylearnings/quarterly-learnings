import { PageHeader } from '@/components/PageHeader/PageHeader'
import { CTABanner } from '@/components/CTABanner/CTABanner'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

export default function ServicesPage() {
  return (
    <>
      <PageHeader eyebrow="What we do" headline="Services" />

      <div id="training">
        <Section>
          <Container className="max-w-3xl mx-auto">
            {/* TODO: replace with final copy from DEV-28 */}
            <Heading level={2} className="mb-6">Technical Training for Teams</Heading>
            <Body className="mb-4">
              I design and deliver focused technical workshops for engineering teams — built around your
              specific stack, timeline, and goals. Whether you&apos;re onboarding engineers to a new tool,
              rolling out a process change, or closing a skills gap, I scope the curriculum to what your
              team actually needs to do.
            </Body>
            <Body className="mb-8">
              Sessions are instructor-led and hands-on. No slide decks, no generic content off the shelf —
              just the material your team needs to move forward, taught by someone who&apos;s done the work.
            </Body>
            <Button variant="secondary" size="md" as="a" href="/contact">
              Let&apos;s talk about your team
            </Button>
          </Container>
        </Section>
      </div>

      <Divider variant="line" />

      <div id="ai-implementation">
        <Section>
          <Container className="max-w-3xl mx-auto">
            {/* TODO: replace with final copy from DEV-28 */}
            <Heading level={2} className="mb-6">AI Implementation for Small Businesses</Heading>
            <Body className="mb-4">
              I work with small business owners to find one real problem AI can solve — then I build it.
              That might be automating a reporting workflow, drafting a customer communication process, or
              connecting tools that currently require manual hand-offs. The scope is always clear and the
              language is always plain.
            </Body>
            <Body className="mb-8">
              No unnecessary complexity, no vague roadmaps. You&apos;ll walk away with something working,
              and you&apos;ll understand how it works.
            </Body>
            <Button variant="secondary" size="md" as="a" href="/contact">
              Tell us about your project
            </Button>
          </Container>
        </Section>
      </div>

      <CTABanner
        headline="Ready to start?"
        subtext="Tell us what you're working on. We'll figure out if we're a good fit."
        cta={{ label: 'Get in touch', href: '/contact' }}
      />
    </>
  )
}
