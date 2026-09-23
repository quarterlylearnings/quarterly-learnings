import { cva, type VariantProps } from 'class-variance-authority'

const badgeVariants = cva(
  'inline-flex items-center font-sans font-medium leading-none rounded-full',
  {
    variants: {
      variant: {
        default: 'bg-tertiary text-white',
        outline: 'border border-tertiary text-tertiary',
        subtle: 'bg-tertiary/10 text-tertiary',
      },
      size: {
        sm: 'px-2.5 py-1 text-label',
        md: 'px-3 py-1.5 text-small',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    label?: string
  }

export function Badge({ className, variant, size, label, children, ...props }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props}>
      {label ?? children}
    </span>
  )
}
