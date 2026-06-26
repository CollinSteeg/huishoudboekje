import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { BooksPage } from './BooksPage'
import { createHouseholdBook } from '../test/helpers'

const createMock = vi.fn()
const updateMock = vi.fn()
const setArchivedMock = vi.fn()

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'user-1', email: 'test@example.com' }, loading: false }),
}))

vi.mock('../hooks/useHouseholdBooks', () => ({
  useHouseholdBooks: () => ({
    books: [createHouseholdBook()],
    loading: false,
    error: null,
  }),
}))

vi.mock('../services/householdBookService', () => ({
  householdBookService: {
    create: (...args: unknown[]) => createMock(...args),
    update: (...args: unknown[]) => updateMock(...args),
    setArchived: (...args: unknown[]) => setArchivedMock(...args),
  },
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <BooksPage />
    </MemoryRouter>,
  )
}

describe('BooksPage', () => {
  it('renders book list and create button', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Mijn huishoudboekjes' })).toBeInTheDocument()
    expect(screen.getByText('Test Boekje')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nieuw boekje' })).toBeInTheDocument()
  })

  it('creates a new book via modal form', async () => {
    const user = userEvent.setup()
    createMock.mockResolvedValue('book-new')
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Nieuw boekje' }))
    await user.type(screen.getByPlaceholderText('Bijv. Gezinsbudget'), 'Nieuw boek')
    await user.click(screen.getByRole('button', { name: 'Aanmaken' }))

    await waitFor(() => {
      expect(createMock).toHaveBeenCalledWith(
        { name: 'Nieuw boek', description: '' },
        'user-1',
      )
    })
  })

  it('opens archive confirmation dialog', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Archiveren' }))
    expect(screen.getByText(/Weet je zeker dat je "Test Boekje" wilt archiveren/)).toBeInTheDocument()
  })
})
