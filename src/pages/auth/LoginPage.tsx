import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Button } from '../../components/shared/Button'
import { FormField, TextInput } from '../../components/shared/FormField'
import { useAuth } from '../../hooks/useAuth'
import { authService } from '../../services/authService'
import { getAuthErrorMessage } from '../../utils/authErrors'

export function LoginPage() {
  const { user, loading } = useAuth()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (isRegister) {
        await authService.signUp(email, password)
      } else {
        await authService.signIn(email, password)
      }
    } catch (err) {
      setError(getAuthErrorMessage(err, isRegister ? 'register' : 'login'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Huishoudboekje</h1>
        <p>{isRegister ? 'Maak een account aan' : 'Log in om verder te gaan'}</p>
        <form className="form" onSubmit={handleSubmit}>
          <FormField label="E-mail">
            <TextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormField>
          <FormField label="Wachtwoord" error={error ?? undefined}>
            <TextInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </FormField>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Bezig...' : isRegister ? 'Registreren' : 'Inloggen'}
          </Button>
        </form>
        <button
          type="button"
          className="link-button"
          onClick={() => setIsRegister((value) => !value)}
        >
          {isRegister
            ? 'Heb je al een account? Log in'
            : 'Nog geen account? Registreer'}
        </button>
      </div>
    </div>
  )
}
