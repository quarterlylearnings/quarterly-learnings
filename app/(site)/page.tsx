import type { CaseStudy } from '@/types/case-study'
import { Hero } from '@/components/Hero/Hero'
import { CTABanner } from '@/components/CTABanner/CTABanner'
import { TestimonialContainer } from '@/components/TestimonialBlock/TestimonialBlock'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Link } from '@/components/ui/Link'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Label } from '@/components/typography/Label'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'

type WorkCard = Pick<CaseStudy, 'client' | 'service' | 'outcome'> & { href: string }

const workCards: WorkCard[] = [
  {
    client: 'Midwest Tech Co.',
    service: 'training',
    outcome: 'Trained 12 engineers on a new CI/CD pipeline across 3 focused sessions.',
    href: '/work/midwest-tech-co',
  },
  {
    client: 'Harbor Consulting',
    service: 'ai-implementation',
    outcome: 'Automated a manual reporting workflow, saving 8 hours per week.',
    href: '/work/harbor-consulting',
  },
  {
    client: 'Northfield Ops',
    service: 'training',
    outcome: 'Built a custom Python curriculum for a non-technical operations team.',
    href: '/work/northfield-ops',
  },
]

const serviceLabel: Record<CaseStudy['service'], string> = {
  training: 'Training',
  'ai-implementation': 'AI Implementation',
}

export default function HomePage() {
  return (
    <>
      {/* Hero — Navigation is transparent here via layout.tsx / Navigation.tsx */}
      {/* TODO: replace /instruction-rear.jpg with final hero photo of Brandon teaching */}
      <Hero
        variant="split"
        eyebrow="Technical Instruction & AI Implementation"
        headline="Build the skills your team needs."
        subtext="Quarterly Learnings delivers focused technical training for teams and practical AI implementation for small businesses. Expert instruction. Clear outcomes. Real work."
        primaryCta={{ label: 'Get in touch', href: '/contact' }}
        secondaryCta={{ label: 'See our work', href: '/work' }}
        image={{
          src: '/instruction-rear.jpg',
          alt: 'An instructor leading a technical workshop with students engaged in the foreground.',
        }}
      />

      {/* Services summary */}
      <Section>
        <Container>
          <Label className="text-neutral uppercase tracking-widest block mb-3">
            What we do
          </Label>
          <Heading level={2} className="mb-10">
            Two ways to work together.
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="interactive" href="/services#training">
              <CardHeader>
                <Badge label="Technical Training" variant="subtle" className="mb-4" />
                <Heading level={3}>For teams that need to learn fast.</Heading>
              </CardHeader>
              <CardBody>
                <Body>
                  Instructor-led workshops scoped to your team&apos;s exact needs. Whether it&apos;s a new tool,
                  language, or workflow — we build a curriculum that fits your team, not a generic one off the shelf.
                </Body>
              </CardBody>
            </Card>

            <Card variant="interactive" href="/services#ai-implementation">
              <CardHeader>
                <Badge label="AI Implementation" variant="subtle" className="mb-4" />
                <Heading level={3}>For businesses ready to put AI to work.</Heading>
              </CardHeader>
              <CardBody>
                <Body>
                  Scoped consulting to identify where AI tooling can solve a real problem in your business — then
                  implementing it. Plain-language throughout. No unnecessary complexity.
                </Body>
              </CardBody>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Work teaser */}
      <Section background="var(--color-secondary)">
        <Container>
          <Label className="text-accent/70 uppercase tracking-widest block mb-3">
            Portfolio
          </Label>
          <Heading level={2} className="text-white mb-10">
            Who we&apos;ve worked with.
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {workCards.map(({ client, service, outcome, href }) => (
              <Card key={client} variant="interactive" href={href}>
                <CardHeader>
                  <Badge label={serviceLabel[service]} variant="subtle" className="mb-3" />
                  <Heading level={4}>{client}</Heading>
                </CardHeader>
                <CardBody>
                  <Body>{outcome}</Body>
                </CardBody>
              </Card>
            ))}
          </div>
          <Link variant="standalone" href="/work">
            View all work
          </Link>
        </Container>
      </Section>

      {/* Testimonials — TestimonialContainer renders null when items is empty */}
      <TestimonialContainer items={[]} />

      {/* CTA */}
      <CTABanner
        headline="Ready to work together?"
        subtext="Tell us what you&apos;re working on. We&apos;ll figure out if we&apos;re a good fit."
        cta={{ label: 'Get in touch', href: '/contact' }}
      />
    </>
  )
}
