import { useState, type FormEvent } from 'react'
import type { Category, CreateTransactionInput, Transaction } from '../../types'
import { toDateInputValue, parseDateInput } from '../../utils/dateHelpers'
import { Button } from '../shared/Button'
import { FormField, SelectInput, TextArea, TextInput } from '../shared/FormField'

interface TransactionFormProps {
  categories: Category[]
  initial?: Transaction
  onSubmit: (data: CreateTransactionInput) => Promise<void>
  onCancel?: () => void
}

export function TransactionForm({
  categories,
  initial,
  onSubmit,
  onCancel,
}: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>(
    initial ? (initial.amount >= 0 ? 'income' : 'expense') : 'expense',
  )
  const [amount, setAmount] = useState(
    initial ? String(Math.abs(initial.amount)) : '',
  )
  const [description, setDescription] = useState(initial?.description ?? '')
  const [date, setDate] = useState(
    toDateInputValue(initial?.date ?? new Date()),
  )
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsedAmount = Number.parseFloat(amount.replace(',', '.'))
    if (!amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Bedrag is verplicht en moet groter dan 0 zijn')
      return
    }

    const signedAmount = type === 'expense' ? -parsedAmount : parsedAmount

    setLoading(true)
    setError(null)
    try {
      await onSubmit({
        amount: signedAmount,
        description: description.trim(),
        date: parseDateInput(date),
        categoryId: categoryId || null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Opslaan mislukt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <FormField label="Type">
        <SelectInput
          value={type}
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
        >
          <option value="expense">Uitgave</option>
          <option value="income">Inkomst</option>
        </SelectInput>
      </FormField>
      <FormField label="Bedrag" error={error ?? undefined}>
        <TextInput
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
        />
      </FormField>
      <FormField label="Datum">
        <TextInput
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </FormField>
      <FormField label="Omschrijving">
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </FormField>
      <FormField label="Categorie">
        <SelectInput
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Geen categorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </SelectInput>
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
