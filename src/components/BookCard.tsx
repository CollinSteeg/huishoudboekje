import { Link } from 'react-router-dom'
import type { HouseholdBook } from '../types'
import { Button } from './Button'

interface BookCardProps {
  book: HouseholdBook
  isOwner: boolean
  isParticipant?: boolean
  onEdit?: () => void
  onArchive?: () => void
  onRestore?: () => void
}

export function BookCard({
  book,
  isOwner,
  isParticipant = false,
  onEdit,
  onArchive,
  onRestore,
}: BookCardProps) {
  return (
    <article className="book-card">
      <div className="book-card__content">
        <h2>
          <Link to={`/books/${book.id}`}>{book.name}</Link>
        </h2>
        {isParticipant && <span className="book-card__badge">Gedeeld met jou</span>}
        {book.description && <p>{book.description}</p>}
      </div>
      {isOwner && (
        <div className="book-card__actions">
          {onEdit && (
            <Button variant="secondary" onClick={onEdit}>
              Bewerken
            </Button>
          )}
          {onArchive && (
            <Button variant="danger" onClick={onArchive}>
              Archiveren
            </Button>
          )}
          {onRestore && (
            <Button variant="primary" onClick={onRestore}>
              Herstellen
            </Button>
          )}
        </div>
      )}
    </article>
  )
}
