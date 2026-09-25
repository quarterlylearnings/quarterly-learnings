'use client'

import NextLink from 'next/link'
import { useActionState } from 'react'
import {
  forgotPasswordAction,
  loginAction,
  resetPasswordAction,
  signupAction,
  type AuthFormState,
} from '@/app/(ledger)/(auth)/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusMessage } from '@/components/ui/StatusMessage'

const initialState: AuthFormState = {}

const withNext = (path: string, next?: string) => (next ? `${path}?next=${encodeURIComponent(next)}` : path)

function Status({ state }: { state: AuthFormState }) {
  if (state.error) return <StatusMessage variant="error" message={state.error} />
  if (state.success) return <StatusMessage variant="success" message={state.success} />
  return null
}

const linkClass = 'font-medium text-tertiary underline underline-offset-2'

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState)
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <Status state={state} />
      <input type="hidden" name="next" value={next ?? ''} />
      <Input label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.email} />
      <Input label="Password" name="password" type="password" autoComplete="current-password" required />
      <Button type="submit" loading={pending}>
        Log in
      </Button>
      <p className="font-sans text-small text-neutral">
        <NextLink href={withNext('/forgot-password', next)} className={linkClass}>
          Forgot your password?
        </NextLink>
        {' · '}
        <NextLink href={withNext('/signup', next)} className={linkClass}>
          Create an account
        </NextLink>
      </p>
    </form>
  )
}

export function SignupForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signupAction, initialState)
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <Status state={state} />
      <input type="hidden" name="next" value={next ?? ''} />
      <Input label="Name" name="name" autoComplete="name" required defaultValue={state.name} />
      <Input label="Email" name="email" type="email" autoComplete="email" required defaultValue={state.email} />
      <Input label="Password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      <Button type="submit" loading={pending}>
        Create account
      </Button>
      <p className="font-sans text-small text-neutral">
        Already have an account?{' '}
        <NextLink href={withNext('/login', next)} className={linkClass}>
          Log in
        </NextLink>
      </p>
    </form>
  )
}

export function ForgotPasswordForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(forgotPasswordAction, initialState)
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <Status state={state} />
      <Input label="Email" name="email" type="email" autoComplete="email" required />
      <Button type="submit" loading={pending}>
        Send reset link
      </Button>
      <p className="font-sans text-small text-neutral">
        <NextLink href={withNext('/login', next)} className={linkClass}>
          Back to log in
        </NextLink>
      </p>
    </form>
  )
}

export function ResetPasswordForm({ token, next }: { token: string; next?: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction, initialState)
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <Status state={state} />
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="next" value={next ?? ''} />
      <Input label="New password" name="password" type="password" autoComplete="new-password" minLength={8} required />
      <Button type="submit" loading={pending}>
        Save password
      </Button>
      {state.error && (
        <p className="font-sans text-small text-neutral">
          <NextLink href="/forgot-password" className={linkClass}>
            Request a new link
          </NextLink>
        </p>
      )}
    </form>
  )
}
