import type { Metadata } from 'next'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Body } from '@/components/typography/Body'
import { Caption } from '@/components/typography/Caption'
import { Heading } from '@/components/typography/Heading'
import { Badge } from '@/components/ui/Badge'
import { getCourseBySlug, getOutline } from '@/lib/ledger/courses'
import { getViewer } from '@/lib/ledger/payload'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourseBySlug((await params).slug)
  return course ? { title: course.title, description: course.description } : {}
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const { payload, user } = await getViewer()
  const lessons = await getOutline(payload, user, course.id)

  return (
    <Container className="py-16">
      <div className="max-w-3xl">
        <Badge variant="subtle" size="sm" className="mb-4 capitalize">
          {course.level}
        </Badge>
        <Heading level={1} className="mb-6">
          {course.title}
        </Heading>
        <Body className="mb-12 text-h4">{course.description}</Body>

        <section aria-labelledby="outline-heading">
          <Heading level={3} as="h2" className="mb-5">
            <span id="outline-heading">Lessons</span>
          </Heading>
          {lessons.length === 0 ? (
            <Body>Lessons will be listed here when they are published.</Body>
          ) : (
            <ol className="divide-y divide-neutral/20 border-y border-neutral/20">
              {lessons.map((lesson, index) => (
                <li key={lesson.id}>
                  <NextLink
                    href={`/courses/${course.slug}/${lesson.slug}`}
                    className="flex items-center gap-4 py-4 hover:bg-neutral/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span className="w-6 shrink-0 text-right font-sans text-small text-neutral" aria-hidden="true">
                      {index + 1}
                    </span>
                    <span className="flex-1 font-sans font-medium text-tertiary">{lesson.title}</span>
                    {lesson.preview && (
                      <Badge variant="outline" size="sm">
                        Free preview
                      </Badge>
                    )}
                    {lesson.estimatedMinutes && <Caption>{lesson.estimatedMinutes} min</Caption>}
                  </NextLink>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </Container>
  )
}
