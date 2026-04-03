import { type LucideIcon } from 'lucide-react'
import { Button } from '../Button'

type EmptyStateProps = {
  icon: LucideIcon
  heading: string
  description: string
  cta?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  heading,
  description,
  cta,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 px-8 text-center ${className ?? ''}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral/10">
        <Icon className="h-8 w-8 text-neutral" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="font-serif text-h3 text-tertiary">{heading}</h3>
        <p className="font-sans text-body text-neutral">{description}</p>
      </div>
      {cta && (
        <Button variant="primary" size="md" onClick={cta.onClick}>
          {cta.label}
        </Button>
      )}
    </div>
  )
}
