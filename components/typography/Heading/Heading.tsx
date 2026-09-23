type HeadingProps = {
  level: 1 | 2 | 3 | 4
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

const tokenMap: Record<1 | 2 | 3 | 4, string> = {
  1: 'font-serif text-h1',
  2: 'font-serif text-h2',
  3: 'font-sans text-h3',
  4: 'font-sans text-h4',
}

export function Heading({ level, as, className, children }: HeadingProps) {
  const Tag = (as ?? `h${level}`) as React.ElementType
  return (
    <Tag className={`${tokenMap[level]} text-tertiary ${className ?? ''}`}>
      {children}
    </Tag>
  )
}
