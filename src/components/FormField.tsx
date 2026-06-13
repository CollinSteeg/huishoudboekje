import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

interface FormFieldProps {
  label: string
  error?: string
  children: ReactNode
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="form-field">
      <span className="form-field__label">{label}</span>
      {children}
      {error && <span className="form-field__error">{error}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="form-field__input" {...props} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="form-field__input form-field__textarea" {...props} />
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="form-field__input" {...props} />
}
