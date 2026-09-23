'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { StatusMessage } from '@/components/ui/StatusMessage'

type FormValues = {
  name: string
  email: string
  organization: string
  service: string
  message: string
}

const SERVICE_OPTIONS = [
  { value: 'training', label: 'Technical Training' },
  { value: 'ai-implementation', label: 'AI Implementation' },
  { value: 'not-sure', label: 'Not sure yet' },
]

export function ContactForm() {
  const router = useRouter()
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    organization: '',
    service: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<FormValues>>({})
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'error'>('idle')

  function validate(): Partial<FormValues> {
    const e: Partial<FormValues> = {}
    if (!values.name.trim()) e.name = 'Name is required.'
    if (!values.email.trim()) e.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Enter a valid email address.'
    if (!values.service) e.service = 'Please select a service.'
    if (!values.message.trim()) e.message = 'Message is required.'
    return e
  }

  function set(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setValues(v => ({ ...v, [field]: e.target.value }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setSubmitStatus('submitting')
    try {
      const res = await fetch('/__forms.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 'form-name': 'contact', ...values }).toString(),
      })
      if (!res.ok) throw new Error()
      // AJAX submissions ignore the form's `action`, so redirect to the success page ourselves
      // (https://docs.netlify.com/manage/forms/setup/#custom-success-page)
      router.push('/success')
    } catch {
      setSubmitStatus('error')
    }
  }

  return (
    <form name="contact" data-netlify="true" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="form-name" value="contact" />
      <div className="flex flex-col gap-6">
        <Input
          label="Name"
          name="name"
          required
          value={values.name}
          onChange={set('name')}
          error={errors.name}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          required
          value={values.email}
          onChange={set('email')}
          error={errors.email}
        />
        <Input
          label="Organization"
          name="organization"
          value={values.organization}
          onChange={set('organization')}
        />
        <Select
          label="Service interest"
          name="service"
          required
          placeholder="Select a service…"
          options={SERVICE_OPTIONS}
          value={values.service}
          onChange={set('service')}
          error={errors.service}
        />
        <Textarea
          label="Message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={set('message')}
          error={errors.message}
        />
        {submitStatus === 'error' && (
          <StatusMessage
            variant="error"
            message="Something went wrong. Please try again."
          />
        )}
        <div>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            loading={submitStatus === 'submitting'}
          >
            Send message
          </Button>
        </div>
      </div>
    </form>
  )
}
