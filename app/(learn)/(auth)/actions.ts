'use server'

import config from '@payload-config'
import { login, logout } from '@payloadcms/next/auth'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { safeNext } from '@/lib/learn/safeNext'

export type AuthFormState = {
  error?: string
  success?: string
  email?: string
  name?: string
}

const MIN_PASSWORD_LENGTH = 8

const field = (formData: FormData, name: string) => String(formData.get(name) ?? '').trim()

export async function loginAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, 'email')
  const password = String(formData.get('password') ?? '')

  try {
    await login({ collection: 'users', config, email, password })
  } catch {
    return { error: 'That email and password don’t match an account.', email }
  }
  redirect(safeNext(formData.get('next')))
}

export async function signupAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = field(formData, 'name')
  const email = field(formData, 'email')
  const password = String(formData.get('password') ?? '')

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use a password with at least ${MIN_PASSWORD_LENGTH} characters.`, email, name }
  }

  const payload = await getPayload({ config })
  const existing = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
  if (existing.totalDocs > 0) {
    return { error: 'An account with this email already exists. Log in instead.', email, name }
  }

  try {
    // overrideAccess: false so field access strips any role; the Users hook makes this a learner.
    await payload.create({
      collection: 'users',
      data: { name, email, password, role: 'learner' },
      overrideAccess: false,
    })
    await login({ collection: 'users', config, email, password })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Sign-up failed' })
    return { error: 'We couldn’t create your account. Check your details and try again.', email, name }
  }
  redirect(safeNext(formData.get('next')))
}

export async function logoutAction() {
  await logout({ config })
  redirect('/courses')
}

export async function forgotPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, 'email')
  const payload = await getPayload({ config })
  try {
    await payload.forgotPassword({ collection: 'users', data: { email } })
  } catch (error) {
    // Logged, not shown: the response must not reveal whether the account exists.
    payload.logger.error({ err: error, msg: 'Forgot-password request failed' })
  }
  return { success: 'If an account exists for that email, we sent a link to reset the password.' }
}

export async function resetPasswordAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const token = String(formData.get('token') ?? '')
  const password = String(formData.get('password') ?? '')

  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use a password with at least ${MIN_PASSWORD_LENGTH} characters.` }
  }

  const payload = await getPayload({ config })
  try {
    const { user } = await payload.resetPassword({
      collection: 'users',
      data: { token, password },
      overrideAccess: true,
    })
    // resetPassword doesn't set our cookie; log in with the new password.
    await login({ collection: 'users', config, email: String(user.email), password })
  } catch {
    return { error: 'This link is invalid or has expired. Request a new one below.' }
  }
  redirect(safeNext(formData.get('next')))
}
