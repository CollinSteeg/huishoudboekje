import { useState } from 'react'
import { BookCard } from '../components/BookCard'
import { BookForm } from '../components/BookForm'
import { Button } from '../components/Button'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { useAuth } from '../hooks/useAuth'
import { useHouseholdBooks } from '../hooks/useHouseholdBooks'
import type { HouseholdBook } from '../types'
import { householdBookService } from '../services/householdBookService'

export function BooksPage() {
  const { user } = useAuth()
  const { books, loading, error } = useHouseholdBooks(user?.uid, false)
  const [showForm, setShowForm] = useState(false)
  const [editingBook, setEditingBook] = useState<HouseholdBook | null>(null)
  const [archivingBook, setArchivingBook] = useState<HouseholdBook | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  async function handleCreate(data: { name: string; description: string }) {
    if (!user) return
    await householdBookService.create(data, user.uid)
    setShowForm(false)
  }

  async function handleUpdate(data: { name: string; description: string }) {
    if (!editingBook) return
    await householdBookService.update(editingBook.id, data)
    setEditingBook(null)
  }

  async function handleArchive() {
    if (!archivingBook) return
    setActionLoading(true)
    try {
      await householdBookService.setArchived(archivingBook.id, true)
      setArchivingBook(null)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <h1>Mijn huishoudboekjes</h1>
          <p>Beheer je uitgaven en inkomsten per boekje.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>Nieuw boekje</Button>
      </div>

      {loading && <p>Laden...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && books.length === 0 && (
        <p className="empty-state">Nog geen huishoudboekjes. Maak er een aan!</p>
      )}

      <div className="card-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isOwner={book.ownerId === user?.uid}
            onEdit={() => setEditingBook(book)}
            onArchive={() => setArchivingBook(book)}
          />
        ))}
      </div>

      <Modal title="Nieuw huishoudboekje" open={showForm} onClose={() => setShowForm(false)}>
        <BookForm
          submitLabel="Aanmaken"
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        title="Boekje bewerken"
        open={!!editingBook}
        onClose={() => setEditingBook(null)}
      >
        {editingBook && (
          <BookForm
            initialName={editingBook.name}
            initialDescription={editingBook.description}
            onSubmit={handleUpdate}
            onCancel={() => setEditingBook(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!archivingBook}
        title="Boekje archiveren"
        message={`Weet je zeker dat je "${archivingBook?.name}" wilt archiveren?`}
        confirmLabel="Archiveren"
        onConfirm={handleArchive}
        onCancel={() => setArchivingBook(null)}
        loading={actionLoading}
      />
    </section>
  )
}
