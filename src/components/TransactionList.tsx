import type { Category, Transaction } from '../types'
import { formatCurrency } from '../utils/formatCurrency'
import { Button } from './Button'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transaction: Transaction) => void
  readOnly?: boolean
}

export function TransactionList({
  transactions,
  categories,
  onEdit,
  onDelete,
  readOnly = false,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return <p className="empty-state">Nog geen transacties deze maand.</p>
  }

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]))

  return (
    <ul className="transaction-list">
      {transactions.map((transaction) => (
        <li key={transaction.id} className="transaction-list__item">
          <div>
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
  )
}
