import { useState, type FormEvent } from 'react'
import type { Category, CreateCategoryInput } from '../../types'
import { toDateInputValue, parseDateInput } from '../../utils/dateHelpers'
import { Button } from '../shared/Button'
import { FormField, TextInput } from '../shared/FormField'

interface CategoryFormProps {
  initial?: Category
  onSubmit: (data: CreateCategoryInput) => Promise<void>
  onCancel?: () => void
}

export function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [maxBudget, setMaxBudget] = useState(
    initial ? String(initial.maxBudget) : '',
  )
  const [endDate, setEndDate] = useState(
    initial?.endDate ? toDateInputValue(initial.endDate) : '',
  )
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Naam is verplicht')
      return
    }
    const parsedBudget = Number.parseFloat(maxBudget.replace(',', '.'))
    if (!maxBudget || Number.isNaN(parsedBudget) || parsedBudget < 0) {
      setError('Maximaal budget is verplicht')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await onSubmit({
        name: name.trim(),
        maxBudget: parsedBudget,
        endDate: endDate ? parseDateInput(endDate) : null,
      })
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
          required
        />
      </FormField>
      <FormField label="Maximaal budget">
        <TextInput
          type="number"
          min="0"
          step="0.01"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
          required
        />
      </FormField>
      <FormField label="Einddatum (optioneel)">
        <TextInput
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </FormField>
      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Annuleren
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Bezig...' : 'Opslaan'}
        </Button>
      </div>
    </form>
  )
}
