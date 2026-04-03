import NextLink from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const linkVariants = cva(
  'inline-flex items-center gap-1 font-sans transition-colors',
  {
    variants: {
      variant: {
        inline: 'underline underline-offset-2 decoration-current text-inherit hover:text-primary hover:decoration-primary',
        standalone: 'text-primary font-medium hover:gap-2',
        nav: 'text-tertiary no-underline hover:text-primary',
      },
    },
    defaultVariants: {
      variant: 'inline',
    },
  }
)

type LinkProps = VariantProps<typeof linkVariants> & {
  href: string
  external?: boolean
  className?: string
  children: React.ReactNode
}

export function Link({ href, variant = 'inline', external, className, children }: LinkProps) {
  const classes = linkVariants({ variant, className })

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        {variant === 'standalone' && (
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">(opens in new tab)</span>
      </a>
    )
  }

  return (
    <NextLink href={href} className={classes}>
      {children}
      {variant === 'standalone' && (
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      )}
    </NextLink>
  )
}
