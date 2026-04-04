type SectionProps = {
  background?: string
  className?: string
  children: React.ReactNode
}

export function Section({ background, className, children }: SectionProps) {
  return (
    <section
      className={`py-16 lg:py-24 ${className ?? ''}`}
      style={background ? { backgroundColor: background } : undefined}
    >
      {children}
    </section>
  )
}
