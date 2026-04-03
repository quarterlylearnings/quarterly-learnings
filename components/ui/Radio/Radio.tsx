'use client'

import { useId } from 'react'

type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  label: string
  id?: string
}

type RadioGroupProps = {
  legend: string
  children: React.ReactNode
  className?: string
}

export function Radio({ label, id: externalId, className, ...props }: RadioProps) {
  const generatedId = useId()
  const id = externalId ?? generatedId

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <input
        type="radio"
        id={id}
        className="h-5 w-5 border-neutral/40 accent-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        {...props}
      />
      <label
        htmlFor={id}
        className="font-sans text-body text-tertiary cursor-pointer select-none"
      >
        {label}
      </label>
    </div>
  )
}

export function RadioGroup({ legend, children, className }: RadioGroupProps) {
  return (
    <fieldset className={`border-none p-0 m-0 ${className ?? ''}`}>
      <legend className="font-sans text-small font-medium text-tertiary mb-3">
        {legend}
      </legend>
      <div className="flex flex-col gap-2">{children}</div>
    </fieldset>
  )
}
