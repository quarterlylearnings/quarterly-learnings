import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { SignupForm } from '@/components/learn/AuthForms'
import { Heading } from '@/components/typography/Heading'
import { getViewer } from '@/lib/learn/payload'
import { safeNext } from '@/lib/learn/safeNext'

export const metadata: Metadata = { title: 'Create an account' }

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const { user } = await getViewer()
  if (user) redirect(safeNext(next))

  return (
    <>
      <Heading level={1} className="mb-8">
        Create an account
      </Heading>
      <SignupForm next={next} />
    </>
  )
}
