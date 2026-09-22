import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { CTABanner } from '@/components/CTABanner/CTABanner'
import { Button } from '@/components/ui/Button'
import { Divider } from '@/components/ui/Divider'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Hands-on technical training for engineering teams and practical AI implementation for small businesses.',
}

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        headline="Services"
        subtext="Two ways to work together: hands-on training for technical teams, and practical AI for small businesses."
      />

      <div id="training">
        <Section>
          <Container className="max-w-3xl mx-auto">
            <Heading level={2} className="mb-6">Technical Training for Teams</Heading>
            <Body className="mb-4">
              Quarterly Learnings designs and teaches hands-on technical training for teams that need to
              learn a specific skill together, whether that&apos;s a new language or framework, a cloud
              platform, a testing practice, or the day-to-day use of AI tools. Every engagement starts with
              what your team needs to be able to do when it&apos;s over, and the curriculum is built backward
              from there, around your stack and your timeline.
            </Body>
            <Body className="mb-8">
              Sessions are instructor-led, in person or virtual, and built on labs and real project work
              rather than slides. Past programs range from a 16-week web development course that finished
              with a 95% completion rate to applied AI sessions for professionals at Columbia Business
              School.
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
            <Heading level={2} className="mb-6">AI Implementation for Small Businesses</Heading>
            <Body className="mb-4">
              Quarterly Learnings helps small business owners put AI to work on one specific problem: the
              report that takes an afternoon to pull together, the documents your staff writes from scratch
              every week, the information that lives in three different places. We start with a conversation
              about how your business actually runs, agree on a clearly scoped piece of work, then build it
              and connect it to the tools you already use.
            </Body>
            <Body className="mb-8">
              You don&apos;t need to be technical, and you won&apos;t get a vague roadmap. You get something
              that works, and an explanation of how it works. For one local business, that meant a custom
              system to run day-to-day operations, with AI-assisted document drafting now rolling out to
              their office staff.
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
