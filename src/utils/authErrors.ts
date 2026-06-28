type AuthAction = 'login' | 'register'

interface FirebaseAuthError {
  code: string
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Onjuist e-mailadres of wachtwoord.',
  'auth/email-already-in-use': 'Dit e-mailadres is al geregistreerd.',
  'auth/invalid-email': 'Ongeldig e-mailadres.',
}

function defaultMessage(action: AuthAction): string {
  return action === 'register' ? 'Registreren mislukt.' : 'Inloggen mislukt.'
}

function getCodeFromError(error: unknown): string | null {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as FirebaseAuthError).code === 'string'
  ) {
    return (error as FirebaseAuthError).code
  }

  if (error instanceof Error) {
    const match = error.message.match(/auth\/[\w-]+/)
    return match?.[0] ?? null
  }

  return null
}

export function getAuthErrorMessage(
  error: unknown,
  action: AuthAction = 'login',
): string {
  const code = getCodeFromError(error)
  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code]
  }
  return defaultMessage(action)
}
