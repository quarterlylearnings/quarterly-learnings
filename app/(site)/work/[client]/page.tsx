import { notFound } from 'next/navigation'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Link } from '@/components/ui/Link'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Label } from '@/components/typography/Label'
import { Section } from '@/components/layout/Section'
import { Container } from '@/components/layout/Container'
import { caseStudies } from '@/data/case-studies'
import type { CaseStudy } from '@/types/case-study'

const serviceLabel: Record<CaseStudy['service'], string> = {
  training: 'Training',
  'ai-implementation': 'AI Implementation',
}

export async function generateStaticParams() {
  return caseStudies.map((s) => ({ client: s.slug }))
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ client: string }>
}) {
  const { client } = await params
  const study = caseStudies.find((s) => s.slug === client)
  if (!study) notFound()

  return (
    <>
      {/* Page header — dark background matching site nav */}
      <Section background="var(--color-tertiary)">
        <Container className="max-w-3xl mx-auto">
          <Badge label={serviceLabel[study.service]} variant="subtle" className="mb-4" />
          <Heading level={1} className="text-white mb-2">
            {study.client}
          </Heading>
          <Label className="text-white/60 uppercase tracking-widest">{study.industry}</Label>
        </Container>
      </Section>

      {/* Case study body */}
      <Section>
        <Container className="max-w-2xl mx-auto">
          <Avatar variant="initials" name={study.client} size="lg" className="mb-8" />

          <Heading level={3} className="mb-3">
            The Challenge
          </Heading>
          <Body>{study.challenge}</Body>

          <Heading level={3} className="mb-3 mt-8">
            How We Approached It
          </Heading>
          <Body>{study.approach}</Body>

          <Heading level={3} className="mb-3 mt-8">
            The Outcome
          </Heading>
          <Body>{study.outcome}</Body>

          {study.testimonial && (
            <figure className="border-l-4 border-primary pl-6 mt-8">
              <blockquote className="font-serif text-h3 italic text-tertiary leading-relaxed">
                &ldquo;{study.testimonial}&rdquo;
              </blockquote>
            </figure>
          )}

          <Link variant="standalone" href="/work" className="mt-10 block">
            ← All work
          </Link>
        </Container>
      </Section>
    </>
  )
}
