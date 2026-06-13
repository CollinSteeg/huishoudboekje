import { useEffect, useState } from 'react'
import type { HouseholdBook } from '../types'
import { householdBookService } from '../services/householdBookService'

export function useHouseholdBook(bookId: string | undefined) {
  const enabled = Boolean(bookId)
  const [book, setBook] = useState<HouseholdBook | null>(null)
  const [syncedBookId, setSyncedBookId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loading = enabled && syncedBookId !== bookId

  useEffect(() => {
    if (!bookId) return

    const unsubscribe = householdBookService.subscribeById(
      bookId,
      (data) => {
        setBook(data)
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

  return {
    book: enabled && syncedBookId === bookId ? book : null,
    loading,
    error: enabled ? error : null,
  }
}
