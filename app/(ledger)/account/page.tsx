import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { NameForm, PasswordForm } from '@/components/ledger/AccountForms'
import { Body } from '@/components/typography/Body'
import { Heading } from '@/components/typography/Heading'
import { getViewer } from '@/lib/ledger/payload'

export const metadata: Metadata = { title: 'Account' }

export default async function AccountPage() {
  const { user } = await getViewer()
  if (!user) redirect('/login?next=/account')

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <Heading level={1} className="mb-2">
        Account
      </Heading>
      <Body className="mb-10">{user.email}</Body>

      <section className="mb-12" aria-labelledby="profile-heading">
        <Heading level={3} as="h2" className="mb-5">
          <span id="profile-heading">Profile</span>
        </Heading>
        <NameForm name={user.name ?? ''} />
      </section>

      <section aria-labelledby="password-heading">
        <Heading level={3} as="h2" className="mb-5">
          <span id="password-heading">Password</span>
        </Heading>
        <PasswordForm />
      </section>
    </div>
  )
}
