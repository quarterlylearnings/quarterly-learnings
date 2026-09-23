'use client'

import { useId } from 'react'

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> & {
  label: string
  id?: string
}

export function Checkbox({ label, id: externalId, className, ...props }: CheckboxProps) {
  const generatedId = useId()
  const id = externalId ?? generatedId

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <input
        type="checkbox"
        id={id}
        className="h-5 w-5 rounded border-neutral/40 accent-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
