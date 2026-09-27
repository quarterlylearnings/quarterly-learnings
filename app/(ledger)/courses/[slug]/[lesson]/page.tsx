import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react'
import NextLink from 'next/link'
import { notFound } from 'next/navigation'
import { RichTextRenderer } from '@/components/ledger/RichTextRenderer'
import { Container } from '@/components/layout/Container'
import { Body } from '@/components/typography/Body'
import { Caption } from '@/components/typography/Caption'
import { Heading } from '@/components/typography/Heading'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Link } from '@/components/ui/Link'
import { getCourseBySlug, getLesson, getOutline, type OutlineLesson } from '@/lib/ledger/courses'
import { formatDate } from '@/lib/ledger/format'
import { getViewer } from '@/lib/ledger/payload'
import { courseAccess } from '@/payload/access/hasCourseAccess'
import { latestQuizResults } from '@/payload/quiz/grade'
import type { Course } from '@/payload-types'

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
  const lessonPath = `${coursePath}/${lesson.slug}`

  const { payload, user } = await getViewer()
  const outline = await getOutline(payload, user, course.id)
  const index = outline.findIndex((item) => item.id === lesson.id)
  const previous = index > 0 ? outline[index - 1] : undefined
  const next = index >= 0 ? outline[index + 1] : undefined

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
          <RichTextRenderer
            content={lesson.content}
            lessonId={lesson.id}
            quizResults={await latestQuizResults(payload, user, lesson.id)}
          />
        ) : (
          <LockedLesson
            course={course}
            coursePath={coursePath}
            lessonPath={lessonPath}
            access={user ? await courseAccess(payload, user, course.id) : null}
          />
        )}

        <LessonNav coursePath={coursePath} previous={previous} next={next} />
      </article>
    </Container>
  )
}

function LockedLesson({
  course,
  coursePath,
  lessonPath,
  access,
}: {
  course: Course
  coursePath: string
  lessonPath: string
  /** Null when logged out. */
  access: Awaited<ReturnType<typeof courseAccess>> | null
}) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg bg-neutral/5 p-8">
      <Lock className="h-6 w-6 text-neutral" aria-hidden="true" />
      {access?.state === 'expired' ? (
        <>
          <Body>Your access ended on {formatDate(access.endedAt)}.</Body>
          <Link href={coursePath} variant="standalone">
            See upcoming cohorts
          </Link>
        </>
      ) : (
        <>
          <Body>This lesson is for learners enrolled in {course.title}.</Body>
          <Button as="a" href={coursePath}>
            Enroll to read
          </Button>
          {!access && (
            <Caption as="p">
              Already enrolled?{' '}
              <NextLink
                href={`/login?next=${encodeURIComponent(lessonPath)}`}
                className="font-medium text-tertiary underline underline-offset-2"
              >
                Log in
              </NextLink>
            </Caption>
          )}
        </>
      )}
    </div>
  )
}

function LessonNav({
  coursePath,
  previous,
  next,
}: {
  coursePath: string
  previous?: OutlineLesson
  next?: OutlineLesson
}) {
  if (!previous && !next) return null
  const linkClass =
    'group flex max-w-[48%] flex-col gap-1 rounded-md p-3 hover:bg-neutral/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
  return (
    <nav aria-label="Lessons" className="mt-16 flex justify-between gap-4 border-t border-neutral/20 pt-6">
      {previous ? (
        <NextLink href={`${coursePath}/${previous.slug}`} className={linkClass} rel="prev">
          <Caption className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Previous
          </Caption>
          <span className="font-sans font-medium text-tertiary">{previous.title}</span>
        </NextLink>
      ) : (
        <span />
      )}
      {next && (
        <NextLink href={`${coursePath}/${next.slug}`} className={`${linkClass} items-end text-right`} rel="next">
          <Caption className="flex items-center gap-1">
            Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Caption>
          <span className="font-sans font-medium text-tertiary">{next.title}</span>
        </NextLink>
      )}
    </nav>
  )
}
