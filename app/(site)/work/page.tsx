import { FolderOpen } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader/PageHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
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

export default function WorkPage() {
  return (
    <>
      <PageHeader eyebrow="Portfolio" headline="Our Work" />

      <Section>
        <Container>
          {caseStudies.length === 0 ? (
            <EmptyState
              icon={FolderOpen}
              heading="Case studies coming soon."
              description="We're documenting our engagements. Check back soon."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {caseStudies.map((study) => (
                <Card key={study.slug} variant="interactive" href={`/work/${study.slug}`}>
                  <CardHeader>
                    <Badge label={serviceLabel[study.service]} variant="subtle" className="mb-3" />
                    <Heading level={3}>{study.client}</Heading>
                    <Label className="text-neutral mt-1 block">{study.industry}</Label>
                  </CardHeader>
                  <CardBody>
                    <Body>{study.outcome}</Body>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  )
}
