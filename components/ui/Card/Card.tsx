'use client'

import { cva, type VariantProps } from 'class-variance-authority'

const cardVariants = cva(
  'rounded-lg overflow-hidden bg-white',
  {
    variants: {
      variant: {
        default: 'border border-neutral/20 shadow-sm hover:shadow-md transition-shadow',
        flat: 'bg-neutral/5',
        interactive:
          'border border-neutral/20 shadow-sm hover:shadow-lg cursor-pointer transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type CardRootProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof cardVariants> & {
    as?: keyof React.JSX.IntrinsicElements
    href?: string
  }

function CardRoot({
  className,
  variant,
  as,
  href,
  children,
  onClick,
  ...props
}: CardRootProps) {
  const isInteractive = variant === 'interactive'
  const Comp = (as ?? (isInteractive && href ? 'a' : 'div')) as any

  function handleKeyDown(e: React.KeyboardEvent) {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault()
      onClick(e as unknown as React.MouseEvent<HTMLElement>)
    }
  }

  return (
    <Comp
      className={cardVariants({ variant, className })}
      href={href}
      onClick={onClick}
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive && !href ? 'button' : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      {...props}
    >
      {children}
    </Comp>
  )
}

function CardMedia({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`w-full overflow-hidden ${className ?? ''}`}>{children}</div>
}

function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`px-6 pt-6 pb-2 ${className ?? ''}`}>{children}</div>
}

function CardBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`px-6 py-4 ${className ?? ''}`}>{children}</div>
}

function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`px-6 pb-6 pt-2 border-t border-neutral/10 ${className ?? ''}`}>
      {children}
    </div>
  )
}

export { CardBody, CardFooter, CardHeader, CardMedia }
export const Card = Object.assign(CardRoot, {
  Media: CardMedia,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})
