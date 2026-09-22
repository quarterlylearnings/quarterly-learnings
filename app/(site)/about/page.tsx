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
            I&apos;m Brandon, and I&apos;ve spent most of my career in the room where engineers learn new
            things. Along the way I&apos;ve taught full-stack development to U.S. military engineering teams
            and USAA developers with Galvanize, founded The Home Depot&apos;s internal engineering bootcamp,
            Orange Method, and led a grant-funded program that took twenty career changers through sixteen
            weeks of web development.
          </Body>
          <Body>
            Quarterly Learnings is where that work continues, now alongside a newer thread: helping people
            put AI to practical use. I teach applied AI sessions sponsored by Columbia Business School and
            build AI-assisted tools for small businesses. What drives both is the same thing: the moment
            someone realizes they can do something they couldn&apos;t do before.
          </Body>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section background="var(--color-secondary)">
        <Container className="max-w-2xl mx-auto">
          <Heading level={2} className="text-white mb-6">How I teach</Heading>
          <Body className="text-white/70 mb-4">
            Good instruction starts with what a learner needs to be able to do, not what a syllabus says
            they should know. I design every session backward from that outcome, keep the group working on
            real problems in their own stack, and measure success by whether people can do the thing the
            next day without me in the room.
          </Body>
          <Body className="text-white/70">
            AI work follows the same rule. We pick one problem worth solving, agree on what
            &ldquo;done&rdquo; looks like, and build it in the open, so when the engagement ends you
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
