import { Button } from '@/components/ui/Button'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

type CTABannerProps = {
  headline: string
  subtext?: string
  cta: { label: string; href: string }
  className?: string
}

export function CTABanner({ headline, subtext, cta, className }: CTABannerProps) {
  return (
    <Section background="var(--color-tertiary)" className={className}>
      <Container>
        <div className="flex flex-col items-center text-center gap-6">
          <Heading level={2} className="text-white max-w-2xl">
            {headline}
          </Heading>
          {subtext && (
            <Body className="text-white/70 max-w-xl">
              {subtext}
            </Body>
          )}
          <Button variant="primary" size="lg" as="a" href={cta.href}>
            {cta.label}
          </Button>
        </div>
      </Container>
    </Section>
  )
}
