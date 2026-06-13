import { useEffect, useState } from 'react'
import type { HouseholdBook } from '../types'
import { householdBookService } from '../services/householdBookService'

export function useHouseholdBooks(ownerId: string | undefined, archived: boolean) {
  const enabled = Boolean(ownerId)
  const [books, setBooks] = useState<HouseholdBook[]>([])
  const [syncKey, setSyncKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const expectedKey = enabled ? `${ownerId}:${archived}` : null
  const loading = enabled && syncKey !== expectedKey

  useEffect(() => {
    if (!ownerId) return

    const unsubscribe = householdBookService.subscribe(
      ownerId,
      archived,
      (data) => {
        setBooks(data)
        setSyncKey(`${ownerId}:${archived}`)
        setError(null)
      },
      (err) => {
        setError(err.message)
        setSyncKey(`${ownerId}:${archived}`)
      },
    )

    return unsubscribe
  }, [ownerId, archived])

  return {
    books: enabled ? books : [],
    loading,
    error: enabled ? error : null,
  }
}
