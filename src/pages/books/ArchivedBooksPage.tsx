import { useState } from 'react'
import { BookCard } from '../../components/books/BookCard'
import { useAuth } from '../../hooks/useAuth'
import { useHouseholdBooks } from '../../hooks/useHouseholdBooks'
import type { HouseholdBook } from '../../types'
import { getBookAccess } from '../../utils/bookAccess'
import { householdBookService } from '../../services/householdBookService'

export function ArchivedBooksPage() {
  const { user } = useAuth()
  const { books, loading, error } = useHouseholdBooks(user, true, false)
  const [restoringBook, setRestoringBook] = useState<HouseholdBook | null>(null)

  async function handleRestore(book: HouseholdBook) {
    setRestoringBook(book)
    try {
      await householdBookService.setArchived(book.id, false)
    } finally {
      setRestoringBook(null)
    }
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Gearchiveerde boekjes</h1>
          <p>Herstel boekjes om ze weer te gebruiken.</p>
        </div>
      </div>

      {loading && <p>Laden...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && books.length === 0 && (
        <p className="empty-state">Geen gearchiveerde boekjes.</p>
      )}

      <div className="card-grid">
        {books.map((book) => {
          const access = user ? getBookAccess(book, user) : null
          return (
            <BookCard
              key={book.id}
              book={book}
              isOwner={access?.isOwner ?? false}
              onRestore={() => handleRestore(book)}
            />
          )
        })}
      </div>

      {restoringBook && <p>Herstellen...</p>}
    </section>
  )
}
