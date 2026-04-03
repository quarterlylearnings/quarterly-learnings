'use client'

import { useId } from 'react'

type SelectOption = { value: string; label: string }

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'id' | 'children'
> & {
  label: string
  options: SelectOption[]
  error?: string
  id?: string
  placeholder?: string
}

const baseSelectClass =
  'w-full appearance-none rounded-md border bg-white px-3 py-2.5 pr-10 font-sans text-body text-tertiary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'

export function Select({
  label,
  options,
  error,
  id: externalId,
  placeholder,
  className,
  required,
  ...props
}: SelectProps) {
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
      <div className="relative">
        <select
          id={id}
          className={`${baseSelectClass} ${
            error ? 'border-error focus:ring-error' : 'border-neutral/30'
          }`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
          <svg
            className="h-4 w-4 text-neutral"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={errorId} role="alert" className="font-sans text-small text-error">
          {error}
        </p>
      )}
    </div>
  )
}
