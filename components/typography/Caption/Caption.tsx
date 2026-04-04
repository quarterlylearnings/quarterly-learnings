type CaptionProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

export function Caption({ as: Tag = 'span', className, children }: CaptionProps) {
  return (
    <Tag className={`font-sans text-small text-neutral ${className ?? ''}`}>
      {children}
    </Tag>
  )
}
