import type { Metadata } from 'next'
import { Lock } from 'lucide-react'
import { notFound } from 'next/navigation'
import { RichTextRenderer } from '@/components/ledger/RichTextRenderer'
import { Container } from '@/components/layout/Container'
import { Body } from '@/components/typography/Body'
import { Heading } from '@/components/typography/Heading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Link } from '@/components/ui/Link'
import { getCourseBySlug, getLesson } from '@/lib/ledger/courses'

type Props = { params: Promise<{ slug: string; lesson: string }> }

async function load(params: Props['params']) {
  const { slug, lesson: lessonSlug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) return null
  const lesson = await getLesson(course.id, lessonSlug)
  return lesson ? { course, lesson } : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const found = await load(params)
  return found ? { title: `${found.lesson.title} · ${found.course.title}` } : {}
}

export default async function LessonPage({ params }: Props) {
  const found = await load(params)
  if (!found) notFound()
  const { course, lesson } = found
  const coursePath = `/courses/${course.slug}`

  return (
    <Container className="py-16">
      <article className="mx-auto max-w-3xl">
        <Link href={coursePath} variant="standalone" className="mb-6">
          {course.title}
        </Link>
        <Heading level={1} className="mb-4">
          {lesson.title}
        </Heading>
        <div className="mb-10 flex items-center gap-3">
          {lesson.preview && (
            <Badge variant="outline" size="sm">
              Free preview
            </Badge>
          )}
          {lesson.estimatedMinutes && <Body as="span">{lesson.estimatedMinutes} min read</Body>}
        </div>

        {lesson.content ? (
          <RichTextRenderer content={lesson.content} />
        ) : (
          <div className="flex flex-col items-start gap-4 rounded-lg bg-neutral/5 p-8">
            <Lock className="h-6 w-6 text-neutral" aria-hidden="true" />
            <Body>This lesson is for learners enrolled in {course.title}.</Body>
            <Button as="a" href={coursePath}>
              Enroll to read
            </Button>
          </div>
        )}
      </article>
    </Container>
  )
}
