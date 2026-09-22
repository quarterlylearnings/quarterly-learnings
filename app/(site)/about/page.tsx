import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { CTABanner } from '@/components/CTABanner/CTABanner'
import { TestimonialContainer } from '@/components/TestimonialBlock/TestimonialBlock'
import { Link } from '@/components/ui/Link'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Brandon Campbell-Kearns is a technical instructor and AI implementation consultant who designs outcome-focused training for real teams.',
}

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" headline="Brandon Campbell-Kearns" />

      {/* Bio */}
      <Section>
        <Container className="max-w-2xl mx-auto">
          <Body className="mb-4">
            {/* TODO(DEV-28): add one sentence after the first on how Brandon first got into teaching */}
            I teach technical skills to teams and help small businesses put AI to practical use. Before
            starting Quarterly Learnings, I founded Orange Method, The Home Depot&apos;s internal engineering
            bootcamp, which trained thousands of associates. With Galvanize, I taught Angular and Java to USAA
            developers and piloted a full-stack curriculum for military engineering teams that supported a
            $60M Department of Defense contract.
          </Body>
          <Body>
            Through Quarterly Learnings, I&apos;ve taught a grant-funded group of twenty people sixteen weeks
            of web development, with a 95% completion rate, and I teach applied AI sessions
            sponsored by Columbia Business School. I also build AI-assisted tools for small
            businesses. Today I work with teams that need to learn a specific skill together and with
            owners who have one problem worth solving with AI.
          </Body>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section background="var(--color-secondary)">
        <Container className="max-w-2xl mx-auto">
          <Heading level={2} className="text-white mb-6">How I teach</Heading>
          <Body className="text-white/70 mb-4">
            I design every session backward from what the group needs to be able to do when it&apos;s
            over. People work on real problems in their own stack, and I measure success by whether they can
            do the work the next day without me in the room.
          </Body>
          <Body className="text-white/70">
            AI engagements follow the same approach. We agree on one problem worth solving and what
            &ldquo;done&rdquo; looks like, then I build it with you, so when the engagement ends you
            understand what you have and can keep using it.
          </Body>
        </Container>
      </Section>

      {/* Proof */}
      <Section>
        <Container className="max-w-2xl mx-auto">
          <Link variant="standalone" href="/work">
            See our work
          </Link>
          {/* TestimonialContainer renders null when items is empty */}
          <TestimonialContainer items={[]} />
        </Container>
      </Section>

      <CTABanner
        headline="Want to work together?"
        subtext="Tell us about your project and we'll figure out if we're a good fit."
        cta={{ label: 'Get in touch', href: '/contact' }}
      />
    </>
  )
}
