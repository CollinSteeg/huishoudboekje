import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { BookDetailPage } from '../BookDetailPage'
import { createCategory, createHouseholdBook, createTransaction } from '../../test/helpers'

const useAuthMock = vi.fn()
const useHouseholdBookMock = vi.fn()

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => useAuthMock(),
}))

vi.mock('../../hooks/useHouseholdBook', () => ({
  useHouseholdBook: () => useHouseholdBookMock(),
}))

vi.mock('../../hooks/useTransactions', () => ({
  useTransactions: () => ({
    transactions: [
      createTransaction({ amount: 1000, description: 'Salaris' }),
      createTransaction({ id: 'tx-2', amount: -50, description: 'Boodschappen' }),
    ],
    loading: false,
    error: null,
  }),
}))

vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({
    plainCategories: [createCategory()],
    categories: [],
    allTransactions: [
      createTransaction({ amount: 1000, description: 'Salaris', date: new Date('2025-05-10') }),
      createTransaction({ id: 'tx-2', amount: -50, description: 'Boodschappen', date: new Date('2025-06-15') }),
    ],
    loading: false,
    error: null,
  }),
}))

vi.mock('../../services/transactionService', () => ({
  transactionService: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

const leaveBookMock = vi.fn()

vi.mock('../../services/householdBookService', () => ({
  householdBookService: {
    leaveBook: (...args: unknown[]) => leaveBookMock(...args),
  },
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/books/book-1']}>
      <Routes>
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/" element={<p>Home</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('BookDetailPage', () => {
  it('renders book details, stats and transactions for owner', () => {
    useAuthMock.mockReturnValue({ user: { uid: 'user-1', email: 'owner@example.com' }, loading: false })
    useHouseholdBookMock.mockReturnValue({
      book: createHouseholdBook(),
      loading: false,
      error: null,
    })
    renderPage()
    expect(screen.getByRole('heading', { name: 'Test Boekje' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Inkomsten en uitgaven per maand' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Uitgaven per categorie' })).toBeInTheDocument()
    expect(screen.getByText('Salaris')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Transactie' })).toBeInTheDocument()
  })

  it('opens transaction form modal for owner', async () => {
    useAuthMock.mockReturnValue({ user: { uid: 'user-1', email: 'owner@example.com' }, loading: false })
    useHouseholdBookMock.mockReturnValue({
      book: createHouseholdBook(),
      loading: false,
      error: null,
    })
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: '+ Transactie' }))
    expect(screen.getByRole('heading', { name: 'Nieuwe transactie' })).toBeInTheDocument()
  })

  it('shows read-only view for participants without write actions', () => {
    useAuthMock.mockReturnValue({
      user: { uid: 'user-2', email: 'participant@example.com' },
      loading: false,
    })
    useHouseholdBookMock.mockReturnValue({
      book: createHouseholdBook({
        participantEmails: ['participant@example.com'],
      }),
      loading: false,
      error: null,
    })

    renderPage()

    expect(screen.getByText('Je hebt alleen-lezen toegang tot dit boekje.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '+ Transactie' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Bewerken' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Verwijderen' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Verlaat boekje' })).toBeInTheDocument()
  })

  it('lets participants leave a shared book', async () => {
    useAuthMock.mockReturnValue({
      user: { uid: 'user-2', email: 'participant@example.com' },
      loading: false,
    })
    useHouseholdBookMock.mockReturnValue({
      book: createHouseholdBook({
        participantEmails: ['participant@example.com'],
      }),
      loading: false,
      error: null,
    })
    leaveBookMock.mockResolvedValue(undefined)

    const user = userEvent.setup()
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Verlaat boekje' }))
    await user.click(screen.getByRole('button', { name: 'Verlaten' }))

    expect(leaveBookMock).toHaveBeenCalledWith('book-1', 'participant@example.com')
    expect(await screen.findByText('Home')).toBeInTheDocument()
  })
})
