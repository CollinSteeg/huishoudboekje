import { useState, type FormEvent } from 'react'
import { Button } from './Button'
import { FormField, TextArea, TextInput } from './FormField'

interface BookFormProps {
  initialName?: string
  initialDescription?: string
  submitLabel?: string
  onSubmit: (data: { name: string; description: string }) => Promise<void>
  onCancel?: () => void
}

export function BookForm({
  initialName = '',
  initialDescription = '',
  submitLabel = 'Opslaan',
  onSubmit,
  onCancel,
}: BookFormProps) {
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState(initialDescription)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Naam is verplicht')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await onSubmit({ name: name.trim(), description: description.trim() })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Opslaan mislukt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormField label="Naam" error={error ?? undefined}>
        <TextInput
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Bijv. Gezinsbudget"
        />
      </FormField>
      <FormField label="Omschrijving">
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optionele omschrijving"
          rows={3}
        />
      </FormField>
      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuleren
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Bezig...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
