import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { ArchivedBooksPage } from '../ArchivedBooksPage'
import { createHouseholdBook } from '../../../test/helpers'

const setArchivedMock = vi.fn()

vi.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'user-1' }, loading: false }),
}))

vi.mock('../../../hooks/useHouseholdBooks', () => ({
  useHouseholdBooks: () => ({
    books: [createHouseholdBook({ archived: true })],
    loading: false,
    error: null,
  }),
}))

vi.mock('../../../services/householdBookService', () => ({
  householdBookService: {
    setArchived: (...args: unknown[]) => setArchivedMock(...args),
  },
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <ArchivedBooksPage />
    </MemoryRouter>,
  )
}

describe('ArchivedBooksPage', () => {
  it('renders archived books', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Gearchiveerde boekjes' })).toBeInTheDocument()
    expect(screen.getByText('Test Boekje')).toBeInTheDocument()
  })

  it('restores an archived book', async () => {
    const user = userEvent.setup()
    setArchivedMock.mockResolvedValue(undefined)
    renderPage()

    await user.click(screen.getByRole('button', { name: 'Herstellen' }))

    await waitFor(() => {
      expect(setArchivedMock).toHaveBeenCalledWith('book-1', false)
    })
  })
})
