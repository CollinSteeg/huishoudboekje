import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Layout } from './Layout'

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'user-1', email: 'test@example.com' }, loading: false }),
}))

vi.mock('../services/authService', () => ({
  authService: { signOut: vi.fn() },
}))

import { authService } from '../services/authService'

describe('Layout', () => {
  it('renders navigation and user email', () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<p>Pagina inhoud</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText('Huishoudboekje')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('Pagina inhoud')).toBeInTheDocument()
  })

  it('calls signOut when logout is clicked', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<p>Inhoud</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: 'Uitloggen' }))
    expect(authService.signOut).toHaveBeenCalledOnce()
  })
})
