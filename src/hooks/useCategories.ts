import { useEffect, useMemo, useState } from 'react'
import type { Category } from '../types'
import { categoryService } from '../services/categoryService'
import { enrichCategoriesWithBudget } from '../utils/budgetHelpers'
import { useAllTransactions } from './useTransactions'

export function useCategories(bookId: string | undefined) {
  const enabled = Boolean(bookId)
  const [rawCategories, setRawCategories] = useState<Category[]>([])
  const [syncedBookId, setSyncedBookId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { transactions, loading: transactionsLoading } = useAllTransactions(bookId)

  const categoriesLoading = enabled && syncedBookId !== bookId

  useEffect(() => {
    if (!bookId) return

    const unsubscribe = categoryService.subscribe(
      bookId,
      (data) => {
        setRawCategories(data)
        setSyncedBookId(bookId)
        setError(null)
      },
      (err) => {
        setError(err.message)
        setSyncedBookId(bookId)
      },
    )

    return unsubscribe
  }, [bookId])

  const categories = useMemo(
    () => enrichCategoriesWithBudget(rawCategories, transactions),
    [rawCategories, transactions],
  )

  return {
    categories: enabled && syncedBookId === bookId ? categories : [],
    plainCategories: enabled && syncedBookId === bookId ? rawCategories : [],
    loading: categoriesLoading || transactionsLoading,
    error: enabled ? error : null,
  }
}
