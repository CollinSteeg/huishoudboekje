import { useState } from 'react'
import type { Category, Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatCurrency'
import { Button } from '../shared/Button'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
  onCategoryChange?: (transactionId: string, categoryId: string | null) => void
  readOnly?: boolean
}

const DRAG_TYPE = 'text/plain'

export function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
  onCategoryChange,
  readOnly = false,
}: TransactionListProps) {
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null)
  const canDrag = !readOnly && !!onCategoryChange && categories.length > 0

  if (transactions.length === 0) {
    return <p className="empty-state">Nog geen transacties deze maand.</p>
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]))

  function handleDrop(categoryId: string | null, event: React.DragEvent) {
    event.preventDefault()
    setActiveDropZone(null)
    const transactionId = event.dataTransfer.getData(DRAG_TYPE)
    if (transactionId && onCategoryChange) {
      onCategoryChange(transactionId, categoryId)
    }
  }

  return (
    <>
      {canDrag && (
        <div className="category-drop-zones">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-drop-zone${activeDropZone === category.id ? ' category-drop-zone--active' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                setActiveDropZone(category.id)
              }}
              onDragLeave={() => setActiveDropZone(null)}
              onDrop={(e) => handleDrop(category.id, e)}
            >
              {category.name}
            </div>
          ))}
          <div
            className={`category-drop-zone${activeDropZone === 'none' ? ' category-drop-zone--active' : ''}`}
            onDragOver={(e) => {
              e.preventDefault()
              setActiveDropZone('none')
            }}
            onDragLeave={() => setActiveDropZone(null)}
            onDrop={(e) => handleDrop(null, e)}
          >
            Geen categorie
          </div>
        </div>
      )}
      <ul className="transaction-list">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="transaction-list__item">
            {canDrag && (
              <span
                className="transaction-list__drag-handle"
                draggable
                aria-label="Slepen naar categorie"
                onDragStart={(e) => {
                  e.dataTransfer.setData(DRAG_TYPE, transaction.id)
                  e.dataTransfer.effectAllowed = 'move'
                }}
              >
                ⋮⋮
              </span>
            )}
            <div className="transaction-list__content">
              <strong>
                {transaction.description || (transaction.amount >= 0 ? 'Inkomst' : 'Uitgave')}
              </strong>
              <div className="transaction-list__meta">
                <span>
                  {transaction.date.toLocaleDateString('nl-NL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {transaction.categoryId && (
                  <span>{categoryMap.get(transaction.categoryId)}</span>
                )}
              </div>
            </div>
            <div className="transaction-list__actions">
              <span
                className={
                  transaction.amount >= 0
                    ? 'transaction-list__amount--income'
                    : 'transaction-list__amount--expense'
                }
              >
                {formatCurrency(transaction.amount)}
              </span>
              {!readOnly && onEdit && onDelete && (
                <>
                  <Button variant="secondary" onClick={() => onEdit(transaction)}>
                    Bewerken
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(transaction)}>
                    Verwijderen
                  </Button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
