type DisplayProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

export function Display({ as: Tag = 'h1', className, children }: DisplayProps) {
  return (
    <Tag className={`font-serif text-display text-tertiary ${className ?? ''}`}>
      {children}
    </Tag>
  )
}
