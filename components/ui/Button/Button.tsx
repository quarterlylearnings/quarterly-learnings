'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { forwardRef } from 'react'

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-sans font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-tertiary hover:bg-primary/80',
        secondary: 'bg-secondary text-white hover:bg-secondary/80',
        ghost: 'bg-transparent text-tertiary hover:bg-tertiary/10',
      },
      size: {
        sm: 'h-9 min-w-[80px] px-4 text-small',
        md: 'h-11 min-w-[100px] px-6 text-body',
        lg: 'h-14 min-w-[120px] px-8 text-h4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type ButtonAsButton = React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' }
type ButtonAsAnchor = React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' }
type ButtonOwnProps = VariantProps<typeof buttonVariants> & { loading?: boolean }
type ButtonProps = ButtonOwnProps & (ButtonAsButton | ButtonAsAnchor)

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant, size, loading, as: Comp = 'button', children, ...props }, ref) => {
    const isDisabled = 'disabled' in props ? props.disabled : false

    return (
      <Comp
        ref={ref as any}
        className={buttonVariants({ variant, size, className })}
        {...(Comp === 'button'
          ? { disabled: isDisabled || loading, 'aria-busy': loading || undefined }
          : {})}
        {...(props as any)}
      >
        {/* Text is invisible during loading but holds the button width */}
        <span className={loading ? 'invisible' : undefined}>{children}</span>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading</span>
          </span>
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
export { Button, buttonVariants }
