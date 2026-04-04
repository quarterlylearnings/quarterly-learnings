import { PageHeader } from '@/components/PageHeader/PageHeader'
import { CTABanner } from '@/components/CTABanner/CTABanner'
import { TestimonialContainer } from '@/components/TestimonialBlock/TestimonialBlock'
import { Link } from '@/components/ui/Link'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" headline="Brandon Campbell-Kearns" />

      {/* Bio */}
      <Section>
        <Container className="max-w-2xl mx-auto">
          {/* TODO: replace with final copy from DEV-28 */}
          <Body className="mb-4">
            I&apos;m a technical instructor and AI implementation consultant based in the Midwest. I got
            into this work because I kept seeing the same pattern: talented teams stuck on tools they were
            never properly taught, and small businesses sitting on problems that AI could already solve —
            if someone would just help them scope it.
          </Body>
          <Body>
            I&apos;ve spent years in the room where engineers learn things — designing curriculum, running
            workshops, debugging live code with real teams. That experience shapes everything I do, whether
            I&apos;m teaching a CI/CD workflow or helping a business owner automate their reporting.
          </Body>
        </Container>
      </Section>

      {/* Philosophy */}
      <Section background="var(--color-secondary)">
        <Container className="max-w-2xl mx-auto">
          {/* TODO: replace with final copy from DEV-28 */}
          <Heading level={2} className="text-white mb-6">How I teach</Heading>
          <Body className="text-white/70 mb-4">
            Good instruction starts with knowing what the learner actually needs to be able to do — not
            what the syllabus says they should know. I design sessions around outcomes, not topics. If
            your team needs to ship a feature using a new tool, that&apos;s what we practice.
          </Body>
          <Body className="text-white/70">
            I keep sessions tight and hands-on. The best measure of a good workshop is whether people
            can do the thing the next day without me in the room.
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
