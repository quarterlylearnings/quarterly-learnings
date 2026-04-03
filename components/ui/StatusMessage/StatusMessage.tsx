'use client'

import { useEffect, useRef } from 'react'
import { CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

const statusVariants = cva(
  'flex items-start gap-3 rounded-md p-4 font-sans text-body focus:outline-none',
  {
    variants: {
      variant: {
        success: 'bg-secondary/10 text-secondary',
        error: 'bg-error/10 text-error',
        info: 'bg-primary/10 text-primary',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
} as const

type StatusMessageProps = VariantProps<typeof statusVariants> & {
  message: string
  className?: string
}

export function StatusMessage({ message, variant = 'info', className }: StatusMessageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const Icon = icons[variant ?? 'info']

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <div
      ref={ref}
      role={variant === 'error' ? 'alert' : 'status'}
      tabIndex={-1}
      className={statusVariants({ variant, className })}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span>{message}</span>
    </div>
  )
}
