import type { Meta, StoryObj } from '@storybook/react'
import { FormField } from './FormField'

const meta: Meta<typeof FormField> = {
  title: 'UI/FormField',
  component: FormField,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  render: () => (
    <FormField label="Full name" id="name" className="w-80">
      <input
        id="name"
        type="text"
        placeholder="Jane Smith"
        className="w-full rounded-md border border-neutral/30 bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </FormField>
  ),
}

export const WithHelperText: Story = {
  render: () => (
    <FormField
      label="Email address"
      id="email"
      helperText="We'll only use this to reply to your enquiry."
      className="w-80"
    >
      <input
        id="email"
        type="email"
        placeholder="you@company.com"
        className="w-full rounded-md border border-neutral/30 bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </FormField>
  ),
}

export const WithError: Story = {
  render: () => (
    <FormField
      label="Email address"
      id="email-err"
      error="Please enter a valid email address."
      required
      className="w-80"
    >
      <input
        id="email-err"
        type="email"
        defaultValue="not-valid"
        aria-invalid="true"
        aria-describedby="email-err-error"
        className="w-full rounded-md border border-error bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
      />
    </FormField>
  ),
}

export const Required: Story = {
  render: () => (
    <FormField label="Message" id="msg" required className="w-80">
      <textarea
        id="msg"
        rows={4}
        placeholder="Tell us about your project…"
        className="w-full rounded-md border border-neutral/30 bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
      />
    </FormField>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="w-80 flex flex-col gap-6">
      <FormField label="Default" id="f1">
        <input id="f1" type="text" placeholder="Placeholder" className="w-full rounded-md border border-neutral/30 bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none" />
      </FormField>
      <FormField label="With helper" id="f2" helperText="This is helper text.">
        <input id="f2" type="text" className="w-full rounded-md border border-neutral/30 bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none" />
      </FormField>
      <FormField label="With error" id="f3" error="This field has an error." required>
        <input id="f3" type="text" defaultValue="bad" aria-invalid="true" className="w-full rounded-md border border-error bg-white px-3 py-2.5 font-sans text-body text-tertiary focus:outline-none" />
      </FormField>
    </div>
  ),
}
