'use client'

import { useActionState } from 'react'
import { changePasswordAction, updateNameAction, type AccountFormState } from '@/app/(learn)/account/actions'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { StatusMessage } from '@/components/ui/StatusMessage'

const initialState: AccountFormState = {}

function Status({ state }: { state: AccountFormState }) {
  if (state.error) return <StatusMessage variant="error" message={state.error} />
  if (state.success) return <StatusMessage variant="success" message={state.success} />
  return null
}

export function NameForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState(updateNameAction, initialState)
  // React resets the form after the action; key on the saved name so the input
  // remounts with it instead of snapping back to the name from the first render.
  const current = state.name ?? name
  return (
    <form action={action} className="flex flex-col gap-5">
      <Status state={state} />
      <Input key={current} label="Name" name="name" autoComplete="name" required defaultValue={current} />
      <Button type="submit" loading={pending} className="self-start">
        Save name
      </Button>
    </form>
  )
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initialState)
  return (
    <form action={action} className="flex flex-col gap-5">
      <Status state={state} />
      <Input label="Current password" name="currentPassword" type="password" autoComplete="current-password" required />
      <Input label="New password" name="newPassword" type="password" autoComplete="new-password" minLength={8} required />
      <Button type="submit" loading={pending} className="self-start">
        Change password
      </Button>
    </form>
  )
}
