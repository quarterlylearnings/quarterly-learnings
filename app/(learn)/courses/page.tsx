import type { Metadata } from 'next'
import { BookOpen } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Body } from '@/components/typography/Body'
import { Heading } from '@/components/typography/Heading'
import { Badge } from '@/components/ui/Badge'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { getViewer } from '@/lib/learn/payload'

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Courses from Quarterly Learnings.',
}

export default async function CoursesPage() {
  const { payload, user } = await getViewer()
  const { docs: courses } = await payload.find({
    collection: 'courses',
    draft: false,
    where: { _status: { equals: 'published' } },
    sort: 'title',
    limit: 100,
    user,
    overrideAccess: false,
  })

  return (
    <Container className="py-16">
      <Heading level={1} className="mb-10">
        Courses
      </Heading>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          heading="No courses yet"
          description="New courses will be listed here when they are published."
        />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <li key={course.id}>
              <Card variant="interactive" href={`/courses/${course.slug}`} className="block h-full">
                <CardHeader>
                  <Badge variant="subtle" size="sm" className="mb-3 capitalize">
                    {course.level}
                  </Badge>
                  <Heading level={3} as="h2">
                    {course.title}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <Body>{course.description}</Body>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Container>
  )
}
