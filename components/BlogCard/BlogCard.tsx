import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Heading } from '@/components/typography/Heading'
import { Body } from '@/components/typography/Body'
import { Caption } from '@/components/typography/Caption'

type BlogCardProps = {
  id: string
  title: string
  date?: string
  dateCreated?: string
  excerpt?: string
  className?: string
}

export function BlogCard({ id, title, date, dateCreated, excerpt, className }: BlogCardProps) {
  const displayDate = date ?? dateCreated
  return (
    <Card variant="interactive" href={`/blog/${id}`} className={className}>
      <CardHeader>
        {displayDate && <Caption className="mb-2 block">{displayDate}</Caption>}
        <Heading level={3}>{title}</Heading>
      </CardHeader>
      {excerpt && (
        <CardBody>
          <Body>{excerpt}</Body>
        </CardBody>
      )}
    </Card>
  )
}
