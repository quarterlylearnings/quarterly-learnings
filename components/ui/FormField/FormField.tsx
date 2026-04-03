type FormFieldProps = {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  id?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  helperText,
  required,
  id,
  children,
  className,
}: FormFieldProps) {
  const errorId = id ? `${id}-error` : undefined
  const helperId = id ? `${id}-helper` : undefined

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
      {children}
      {helperText && !error && (
        <p id={helperId} className="font-sans text-small text-neutral">
          {helperText}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="font-sans text-small text-error">
          {error}
        </p>
      )}
    </div>
  )
}
