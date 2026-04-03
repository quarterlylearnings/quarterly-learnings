type DividerProps = {
  variant?: 'line' | 'labeled'
  label?: string
  className?: string
}

export function Divider({ variant = 'line', label, className }: DividerProps) {
  if (variant === 'labeled') {
    return (
      <div
        role="separator"
        className={`flex items-center gap-3 ${className ?? ''}`}
      >
        <div className="flex-1 border-t border-neutral/20" aria-hidden="true" />
        <span className="font-sans text-label text-neutral font-medium uppercase tracking-wider">
          {label}
        </span>
        <div className="flex-1 border-t border-neutral/20" aria-hidden="true" />
      </div>
    )
  }

  return (
    <hr
      className={`border-t border-neutral/20 ${className ?? ''}`}
    />
  )
}
