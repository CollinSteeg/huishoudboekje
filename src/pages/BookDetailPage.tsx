import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { Modal } from '../components/Modal'
import { MonthPicker } from '../components/MonthPicker'
import { StatCard } from '../components/StatCard'
import { TransactionForm } from '../components/TransactionForm'
import { TransactionList } from '../components/TransactionList'
import { useAuth } from '../hooks/useAuth'
import { useCategories } from '../hooks/useCategories'
import { useHouseholdBook } from '../hooks/useHouseholdBook'
import { useTransactions } from '../hooks/useTransactions'
import type { Transaction } from '../types'
import { currentMonthFilter } from '../utils/dateHelpers'
import { transactionService } from '../services/transactionService'

export function BookDetailPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const { user } = useAuth()
  const { book, loading: bookLoading } = useHouseholdBook(bookId)
  const [monthFilter, setMonthFilter] = useState(currentMonthFilter())
  const { transactions, loading: txLoading } = useTransactions(bookId, monthFilter)
  const { plainCategories } = useCategories(bookId)
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const stats = useMemo(() => {
    const income = transactions
      .filter((tx) => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0)
    const expenses = transactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + tx.amount, 0)
    return { income, expenses, balance: income + expenses }
  }, [transactions])

  if (bookLoading) {
    return <p>Laden...</p>
  }

  if (!book || book.archived) {
    return <Navigate to="/" replace />
  }

  if (book.ownerId !== user?.uid) {
    return <p className="error">Je hebt geen toegang tot dit boekje.</p>
  }

  async function handleCreate(data: Parameters<typeof transactionService.create>[1]) {
    if (!bookId) return
    await transactionService.create(bookId, data)
    setShowForm(false)
  }

  async function handleUpdate(data: Parameters<typeof transactionService.create>[1]) {
    if (!bookId || !editingTransaction) return
    await transactionService.update(bookId, editingTransaction.id, data)
    setEditingTransaction(null)
  }

  async function handleDelete() {
    if (!bookId || !deletingTransaction) return
    setActionLoading(true)
    try {
      await transactionService.delete(bookId, deletingTransaction.id)
      setDeletingTransaction(null)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <p className="breadcrumb">
            <Link to="/">Boekjes</Link> / {book.name}
          </p>
          <h1>{book.name}</h1>
          {book.description && <p>{book.description}</p>}
        </div>
        <div className="page__header-actions">
          <Link to={`/books/${bookId}/categories`}>
            <Button variant="secondary">Categorieën</Button>
          </Link>
          <Button onClick={() => setShowForm(true)}>+ Transactie</Button>
        </div>
      </div>

      <MonthPicker filter={monthFilter} onChange={setMonthFilter} />

      <div className="stats-grid">
        <StatCard label="Inkomsten" amount={stats.income} variant="income" />
        <StatCard label="Uitgaven" amount={stats.expenses} variant="expense" />
        <StatCard label="Saldo" amount={stats.balance} variant="balance" />
      </div>

      {txLoading ? (
        <p>Laden...</p>
      ) : (
        <TransactionList
          transactions={transactions}
          categories={plainCategories}
          onEdit={setEditingTransaction}
          onDelete={setDeletingTransaction}
        />
      )}

      <Modal title="Nieuwe transactie" open={showForm} onClose={() => setShowForm(false)}>
        <TransactionForm
          categories={plainCategories}
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        title="Transactie bewerken"
        open={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
      >
        {editingTransaction && (
          <TransactionForm
            categories={plainCategories}
            initial={editingTransaction}
            onSubmit={handleUpdate}
            onCancel={() => setEditingTransaction(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deletingTransaction}
        title="Transactie verwijderen"
        message="Weet je zeker dat je deze transactie wilt verwijderen?"
        confirmLabel="Verwijderen"
        onConfirm={handleDelete}
        onCancel={() => setDeletingTransaction(null)}
        loading={actionLoading}
      />
    </section>
  )
}
