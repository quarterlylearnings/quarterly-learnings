type BodyProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

export function Body({ as: Tag = 'p', className, children }: BodyProps) {
  return (
    <Tag className={`font-sans text-body text-neutral ${className ?? ''}`}>
      {children}
    </Tag>
  )
}
