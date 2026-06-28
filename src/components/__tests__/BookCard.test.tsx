import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { BookCard } from '../BookCard'
import { createHouseholdBook } from '../../test/helpers'

describe('BookCard', () => {
  const book = createHouseholdBook()

  it('renders book name and description with link', () => {
    render(
      <MemoryRouter>
        <BookCard book={book} isOwner={false} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: book.name })).toHaveAttribute('href', '/books/book-1')
    expect(screen.getByText('Test omschrijving')).toBeInTheDocument()
  })

  it('shows owner actions and calls handlers', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onArchive = vi.fn()
    render(
      <MemoryRouter>
        <BookCard book={book} isOwner onEdit={onEdit} onArchive={onArchive} />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: 'Bewerken' }))
    await user.click(screen.getByRole('button', { name: 'Archiveren' }))
    expect(onEdit).toHaveBeenCalledOnce()
    expect(onArchive).toHaveBeenCalledOnce()
  })

  it('shows shared badge for participants', () => {
    render(
      <MemoryRouter>
        <BookCard book={book} isOwner={false} isParticipant />
      </MemoryRouter>,
    )
    expect(screen.getByText('Gedeeld met jou')).toBeInTheDocument()
  })

  it('shows restore button for archived books', async () => {
    const user = userEvent.setup()
    const onRestore = vi.fn()
    render(
      <MemoryRouter>
        <BookCard book={book} isOwner onRestore={onRestore} />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('button', { name: 'Herstellen' }))
    expect(onRestore).toHaveBeenCalledOnce()
  })
})
