'use client'

import { useId } from 'react'

type TextareaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> & {
  label: string
  error?: string
  id?: string
  rows?: number
}

const baseTextareaClass =
  'w-full rounded-md border bg-white px-3 py-2.5 font-sans text-body text-tertiary placeholder:text-neutral/60 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-y'

export function Textarea({
  label,
  error,
  id: externalId,
  rows = 4,
  className,
  required,
  ...props
}: TextareaProps) {
  const generatedId = useId()
  const id = externalId ?? generatedId
  const errorId = `${id}-error`

  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <label htmlFor={id} className="font-sans text-small font-medium text-tertiary">
        {label}
        {required && (
          <span className="text-error ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`${baseTextareaClass} ${
          error ? 'border-error focus:ring-error' : 'border-neutral/30'
        }`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        required={required}
        {...props}
      />
      {error && (
        <p id={errorId} role="alert" className="font-sans text-small text-error">
          {error}
        </p>
      )}
    </div>
  )
}
