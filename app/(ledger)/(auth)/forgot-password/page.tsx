import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/ledger/AuthForms'
import { Body } from '@/components/typography/Body'
import { Heading } from '@/components/typography/Heading'

export const metadata: Metadata = { title: 'Reset your password' }

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  return (
    <>
      <Heading level={1} className="mb-4">
        Reset your password
      </Heading>
      <Body className="mb-8">Enter the email address on your account and we’ll send you a link to choose a new password.</Body>
      <ForgotPasswordForm next={next} />
    </>
  )
}
