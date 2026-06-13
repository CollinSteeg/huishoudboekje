import { useState } from 'react'
import { BookCard } from '../components/BookCard'
import { useAuth } from '../hooks/useAuth'
import { useHouseholdBooks } from '../hooks/useHouseholdBooks'
import type { HouseholdBook } from '../types'
import { householdBookService } from '../services/householdBookService'

export function ArchivedBooksPage() {
  const { user } = useAuth()
  const { books, loading, error } = useHouseholdBooks(user?.uid, true)
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
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isOwner={book.ownerId === user?.uid}
            onRestore={() => handleRestore(book)}
          />
        ))}
      </div>

      {restoringBook && <p>Herstellen...</p>}
    </section>
  )
}
