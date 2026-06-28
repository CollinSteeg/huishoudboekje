import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from '../ProtectedRoute'

const useAuthMock = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

describe('ProtectedRoute', () => {
  it('shows loading state', () => {
    useAuthMock.mockReturnValue({ user: null, loading: true })
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Beschermd</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Laden...')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    useAuthMock.mockReturnValue({ user: null, loading: false })
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Beschermd</p>} />
          </Route>
          <Route path="/login" element={<p>Login</p>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('renders child route when authenticated', () => {
    useAuthMock.mockReturnValue({ user: { uid: 'user-1' }, loading: false })
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Beschermd</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Beschermd')).toBeInTheDocument()
  })
})
