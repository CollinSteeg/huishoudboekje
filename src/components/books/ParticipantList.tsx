import { useState, type FormEvent } from 'react'
import { Button } from '../shared/Button'
import { FormField, TextInput } from '../shared/FormField'
import { householdBookService } from '../../services/householdBookService'
import { userEmailService } from '../../services/userEmailService'
import { normalizeEmail } from '../../utils/email'

interface ParticipantListProps {
  bookId: string
  participantEmails: string[]
  ownerEmail?: string | null
}

export function ParticipantList({
  bookId,
  participantEmails,
  ownerEmail,
}: ParticipantListProps) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [removingEmail, setRemovingEmail] = useState<string | null>(null)

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    const normalized = normalizeEmail(email)
    if (!normalized) return

    if (ownerEmail && normalized === normalizeEmail(ownerEmail)) {
      setError('Je kunt jezelf niet als deelnemer toevoegen.')
      return
    }

    if (participantEmails.includes(normalized)) {
      setError('Deze deelnemer is al toegevoegd.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const uid = await userEmailService.lookup(normalized)
      if (!uid) {
        setError('Geen account gevonden met dit e-mailadres.')
        return
      }
      await householdBookService.addParticipant(bookId, normalized)
      setEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deelnemer toevoegen mislukt')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRemove(participantEmail: string) {
    setRemovingEmail(participantEmail)
    setError(null)
    try {
      await householdBookService.removeParticipant(bookId, participantEmail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deelnemer verwijderen mislukt')
    } finally {
      setRemovingEmail(null)
    }
  }

  return (
    <details className="participant-list">
      <summary>Deelnemers</summary>
      <p className="participant-list__hint">
        Nodig anderen uit om dit boekje te bekijken. Deelnemers kunnen alleen lezen.
      </p>

      {participantEmails.length === 0 ? (
        <p className="empty-state">Nog geen deelnemers.</p>
      ) : (
        <ul className="participant-list__items">
          {participantEmails.map((participantEmail) => (
            <li key={participantEmail} className="participant-list__item">
              <span>{participantEmail}</span>
              <Button
                variant="danger"
                onClick={() => handleRemove(participantEmail)}
                disabled={removingEmail === participantEmail}
              >
                {removingEmail === participantEmail ? 'Bezig...' : 'Verwijderen'}
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form className="form participant-list__form" onSubmit={handleAdd}>
        <FormField label="E-mailadres deelnemer" error={error ?? undefined}>
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="naam@voorbeeld.nl"
            required
          />
        </FormField>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Bezig...' : 'Deelnemer toevoegen'}
        </Button>
      </form>
    </details>
  )
}
