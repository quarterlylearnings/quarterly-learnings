import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Body } from '@/components/typography/Body'
import { Heading } from '@/components/typography/Heading'
import { Link } from '@/components/ui/Link'
import { getViewer } from '@/lib/ledger/payload'
import { courseProgress } from '@/payload/progress/progress'

export const metadata: Metadata = { title: 'Progress' }

export default async function ProgressPage() {
  const { payload, user } = await getViewer()
  if (!user) redirect('/login?next=/progress')

  const rows = await courseProgress(payload, user)

  return (
    <Container className="py-16">
      <div className="max-w-3xl">
        <Heading level={1} className="mb-10">
          Progress
        </Heading>

        {rows.length === 0 ? (
          <>
            <Body className="mb-6">Courses you’re enrolled in will show here, with the lessons you’ve completed.</Body>
            <Link href="/courses" variant="standalone">
              Browse courses
            </Link>
          </>
        ) : (
          <ul className="divide-y divide-neutral/20 border-y border-neutral/20">
            {rows.map(({ course, completed, total, nextLesson }) => (
              <li key={course.id} className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <Heading level={4} as="h2">
                    {course.title}
                  </Heading>
                  <Body className="mt-1">
                    {completed} of {total} lessons complete
                  </Body>
                  <div
                    className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-neutral/15"
                    role="progressbar"
                    aria-label={`${course.title} progress`}
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={completed}
                  >
                    <div className="h-full bg-secondary" style={{ width: `${total ? (completed / total) * 100 : 0}%` }} />
                  </div>
                </div>
                {nextLesson ? (
                  <Link href={`/courses/${course.slug}/${nextLesson.slug}`} variant="standalone">
                    Next: {nextLesson.title}
                  </Link>
                ) : (
                  <Link href={`/courses/${course.slug}`} variant="standalone">
                    Review the course
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  )
}
