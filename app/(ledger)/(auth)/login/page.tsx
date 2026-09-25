import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/ledger/AuthForms'
import { Heading } from '@/components/typography/Heading'
import { getViewer } from '@/lib/ledger/payload'
import { safeNext } from '@/lib/ledger/safeNext'

export const metadata: Metadata = { title: 'Log in' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const { user } = await getViewer()
  if (user) redirect(safeNext(next))

  return (
    <>
      <Heading level={1} className="mb-8">
        Log in
      </Heading>
      <LoginForm next={next} />
    </>
  )
}
