import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { BookDetailPage } from './BookDetailPage'
import { createCategory, createHouseholdBook, createTransaction } from '../test/helpers'

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'user-1' }, loading: false }),
}))

vi.mock('../hooks/useHouseholdBook', () => ({
  useHouseholdBook: () => ({
    book: createHouseholdBook(),
    loading: false,
    error: null,
  }),
}))

vi.mock('../hooks/useTransactions', () => ({
  useTransactions: () => ({
    transactions: [
      createTransaction({ amount: 1000, description: 'Salaris' }),
      createTransaction({ id: 'tx-2', amount: -50, description: 'Boodschappen' }),
    ],
    loading: false,
    error: null,
  }),
}))

vi.mock('../hooks/useCategories', () => ({
  useCategories: () => ({
    plainCategories: [createCategory()],
    categories: [],
    loading: false,
    error: null,
  }),
}))

vi.mock('../services/transactionService', () => ({
  transactionService: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
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
  it('renders book details, stats and transactions', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Test Boekje' })).toBeInTheDocument()
    expect(screen.getByText('Inkomsten')).toBeInTheDocument()
    expect(screen.getByText('Uitgaven')).toBeInTheDocument()
    expect(screen.getByText('Saldo')).toBeInTheDocument()
    expect(screen.getByText('Salaris')).toBeInTheDocument()
    expect(screen.getAllByText('Boodschappen').length).toBeGreaterThan(0)
  })

  it('opens transaction form modal', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: '+ Transactie' }))
    expect(screen.getByRole('heading', { name: 'Nieuwe transactie' })).toBeInTheDocument()
  })
})
