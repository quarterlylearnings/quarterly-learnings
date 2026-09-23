import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Label } from '@/components/typography/Label'
import { Container } from '@/components/layout/Container'

type PageHeaderProps = {
  eyebrow?: string
  headline: string
  subtext?: string
  background?: string
  className?: string
}

export function PageHeader({
  eyebrow,
  headline,
  subtext,
  background = 'var(--color-tertiary)',
  className,
}: PageHeaderProps) {
  return (
    <div
      className={`py-16 lg:py-20 ${className ?? ''}`}
      style={{ backgroundColor: background }}
    >
      <Container>
        <div className="flex flex-col gap-4 max-w-3xl">
          {eyebrow && (
            <Label className="text-primary uppercase tracking-widest">
              {eyebrow}
            </Label>
          )}
          <Heading level={1} className="text-white">
            {headline}
          </Heading>
          {subtext && (
            <Body className="text-white/70 max-w-xl">
              {subtext}
            </Body>
          )}
        </div>
      </Container>
    </div>
  )
}
