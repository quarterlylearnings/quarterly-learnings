import type { Metadata } from 'next'
import NextLink from 'next/link'
import { ResetPasswordForm } from '@/components/ledger/AuthForms'
import { Body } from '@/components/typography/Body'
import { Heading } from '@/components/typography/Heading'

export const metadata: Metadata = { title: 'Choose a password' }

type SearchParams = Promise<{ token?: string; welcome?: string; next?: string }>

export default async function ResetPasswordPage({ searchParams }: { searchParams: SearchParams }) {
  const { token, welcome, next } = await searchParams
  const isWelcome = welcome === '1'

  if (!token) {
    return (
      <>
        <Heading level={1} className="mb-4">
          This link is incomplete
        </Heading>
        <Body>
          Open the link from your email again, or{' '}
          <NextLink href="/forgot-password" className="font-medium text-tertiary underline underline-offset-2">
            request a new one
          </NextLink>
          .
        </Body>
      </>
    )
  }

  return (
    <>
      <Heading level={1} className="mb-4">
        {isWelcome ? 'Set your password' : 'Choose a new password'}
      </Heading>
      <Body className="mb-8">
        {isWelcome
          ? 'Your Quarterly Learnings account is ready. Choose a password to start the course.'
          : 'Choose a new password for your Quarterly Learnings account.'}
      </Body>
      <ResetPasswordForm token={token} next={next} />
    </>
  )
}
