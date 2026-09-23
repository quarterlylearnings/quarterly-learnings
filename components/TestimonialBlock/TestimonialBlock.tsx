import { Caption } from '@/components/typography/Caption'

type TestimonialProps = {
  quote: string
  name: string
  role?: string
  company?: string
  className?: string
}

type TestimonialContainerProps = {
  items: TestimonialProps[]
  className?: string
}

export function Testimonial({ quote, name, role, company, className }: TestimonialProps) {
  const attribution = [role, company].filter(Boolean).join(', ')

  return (
    <figure className={`border-l-4 border-primary pl-6 ${className ?? ''}`}>
      <blockquote className="font-serif text-h3 italic text-tertiary leading-relaxed">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4">
        <Caption className="text-neutral font-medium not-italic">
          — {name}{attribution ? `, ${attribution}` : ''}
        </Caption>
      </figcaption>
    </figure>
  )
}

export function TestimonialContainer({ items, className }: TestimonialContainerProps) {
  if (!items.length) return null

  return (
    <div className={`flex flex-col gap-12 ${className ?? ''}`}>
      {items.map((item, i) => (
        <Testimonial key={i} {...item} />
      ))}
    </div>
  )
}
