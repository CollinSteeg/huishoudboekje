import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoginPage } from '../LoginPage'

const signInMock = vi.fn()
const signUpMock = vi.fn()
const useAuthMock = vi.fn()

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

vi.mock('../../../services/authService', () => ({
  authService: {
    signIn: (...args: unknown[]) => signInMock(...args),
    signUp: (...args: unknown[]) => signUpMock(...args),
  },
}))

describe('LoginPage', () => {
  it('renders login form', () => {
    useAuthMock.mockReturnValue({ user: null, loading: false })
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(screen.getByText('Log in om verder te gaan')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Wachtwoord')).toBeInTheDocument()
  })

  it('submits login credentials', async () => {
    useAuthMock.mockReturnValue({ user: null, loading: false })
    const user = userEvent.setup()
    signInMock.mockResolvedValue(undefined)
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('E-mail'), 'test@example.com')
    await user.type(screen.getByLabelText('Wachtwoord'), 'secret123')
    await user.click(screen.getByRole('button', { name: 'Inloggen' }))

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('test@example.com', 'secret123')
    })
  })

  it('switches to registration mode', async () => {
    useAuthMock.mockReturnValue({ user: null, loading: false })
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: 'Nog geen account? Registreer' }))
    expect(screen.getByText('Maak een account aan')).toBeInTheDocument()
  })
})
