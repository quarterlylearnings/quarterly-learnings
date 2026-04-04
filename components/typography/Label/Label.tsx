type LabelProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

export function Label({ as: Tag = 'span', className, children }: LabelProps) {
  return (
    <Tag className={`font-sans text-label font-medium text-neutral ${className ?? ''}`}>
      {children}
    </Tag>
  )
}
