import { useEffect, useState } from 'react'
import type { MonthFilter, Transaction } from '../types'
import { transactionService } from '../services/transactionService'

function monthKey(bookId: string, filter: MonthFilter) {
  return `${bookId}:${filter.year}-${filter.month}`
}

export function useTransactions(bookId: string | undefined, filter: MonthFilter) {
  const enabled = Boolean(bookId)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [syncKey, setSyncKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const expectedKey = enabled ? monthKey(bookId!, filter) : null
  const loading = enabled && syncKey !== expectedKey

  useEffect(() => {
    if (!bookId) return

    const monthFilter = { month: filter.month, year: filter.year }
    const currentKey = monthKey(bookId, monthFilter)
    const unsubscribe = transactionService.subscribe(
      bookId,
      monthFilter,
      (data) => {
        setTransactions(data)
        setSyncKey(currentKey)
        setError(null)
      },
      (err) => {
        setError(err.message)
        setSyncKey(currentKey)
      },
    )

    return unsubscribe
  }, [bookId, filter.month, filter.year])

  return {
    transactions: enabled && syncKey === expectedKey ? transactions : [],
    loading,
    error: enabled ? error : null,
  }
}

export function useAllTransactions(bookId: string | undefined) {
  const enabled = Boolean(bookId)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [syncedBookId, setSyncedBookId] = useState<string | null>(null)

  const loading = enabled && syncedBookId !== bookId

  useEffect(() => {
    if (!bookId) return

    const unsubscribe = transactionService.subscribeAll(bookId, (data) => {
      setTransactions(data)
      setSyncedBookId(bookId)
    })

    return unsubscribe
  }, [bookId])

  return {
    transactions: enabled && syncedBookId === bookId ? transactions : [],
    loading,
  }
}
