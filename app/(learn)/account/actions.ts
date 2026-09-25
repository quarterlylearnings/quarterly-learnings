'use server'

import config from '@payload-config'
import { login } from '@payloadcms/next/auth'
import { revalidatePath } from 'next/cache'
import { getViewer } from '@/lib/learn/payload'

export type AccountFormState = { error?: string; success?: string; name?: string }

const MIN_PASSWORD_LENGTH = 8

export async function updateNameAction(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const { payload, user } = await getViewer()
  if (!user) return { error: 'Your session has ended. Log in again.' }

  const name = String(formData.get('name') ?? '').trim()
  if (!name) return { error: 'Enter your name.' }

  await payload.update({ collection: 'users', id: user.id, data: { name }, user, overrideAccess: false })
  revalidatePath('/account')
  return { success: 'Name saved.', name }
}

export async function changePasswordAction(_prev: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const { payload, user } = await getViewer()
  if (!user) return { error: 'Your session has ended. Log in again.' }

  const current = String(formData.get('currentPassword') ?? '')
  const next = String(formData.get('newPassword') ?? '')
  if (next.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use a new password with at least ${MIN_PASSWORD_LENGTH} characters.` }
  }

  try {
    // Confirm the current password without touching the session cookie.
    await payload.login({ collection: 'users', data: { email: user.email, password: current } })
  } catch {
    return { error: 'Your current password is incorrect.' }
  }

  await payload.update({ collection: 'users', id: user.id, data: { password: next }, user, overrideAccess: false })
  // Changing the password ends existing sessions; start a fresh one.
  await login({ collection: 'users', config, email: user.email, password: next })
  return { success: 'Password changed.' }
}
