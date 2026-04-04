import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { Display } from '@/components/typography/Display'
import { Body } from '@/components/typography/Body'
import { Label } from '@/components/typography/Label'
import { Container } from '@/components/layout/Container'

type HeroProps = {
  eyebrow?: string
  headline: string
  subtext?: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  variant?: 'centered' | 'split'
  image?: { src: string; alt: string }
  background?: string
  className?: string
}

export function Hero({
  eyebrow,
  headline,
  subtext,
  primaryCta,
  secondaryCta,
  variant = 'centered',
  image,
  background = 'var(--color-tertiary)',
  className,
}: HeroProps) {
  const isSplit = variant === 'split' && image

  return (
    <div
      className={`py-20 lg:py-28 ${className ?? ''}`}
      style={{ backgroundColor: background }}
    >
      <Container>
        {isSplit ? (
          /* Split layout — stacks on mobile, side-by-side on lg+ */
          <div className="flex flex-col items-center text-center gap-10 lg:grid lg:grid-cols-12 lg:items-center lg:text-left lg:gap-12">
            {/* Content — left 6 cols on desktop */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <HeroContent
                eyebrow={eyebrow}
                headline={headline}
                subtext={subtext}
                primaryCta={primaryCta}
                secondaryCta={secondaryCta}
              />
            </div>
            {/* Image — right 6 cols on desktop */}
            <div className="lg:col-span-6 relative w-full aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        ) : (
          /* Centered layout */
          <div className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
            <HeroContent
              eyebrow={eyebrow}
              headline={headline}
              subtext={subtext}
              primaryCta={primaryCta}
              secondaryCta={secondaryCta}
            />
          </div>
        )}
      </Container>
    </div>
  )
}

type HeroContentProps = Pick<HeroProps, 'eyebrow' | 'headline' | 'subtext' | 'primaryCta' | 'secondaryCta'>

function HeroContent({ eyebrow, headline, subtext, primaryCta, secondaryCta }: HeroContentProps) {
  return (
    <>
      {eyebrow && (
        <Label className="text-primary uppercase tracking-widest">
          {eyebrow}
        </Label>
      )}
      <Display className="text-white">
        {headline}
      </Display>
      {subtext && (
        <Body className="text-white/70 text-h4 leading-relaxed">
          {subtext}
        </Body>
      )}
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
        <Button variant="primary" size="lg" as="a" href={primaryCta.href}>
          {primaryCta.label}
        </Button>
        {secondaryCta && (
          <Button
            variant="ghost"
            size="lg"
            as="a"
            href={secondaryCta.href}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            {secondaryCta.label}
          </Button>
        )}
      </div>
    </>
  )
}
