import { useEffect, useState } from 'react'
import type { HouseholdBook } from '../types'
import { householdBookService } from '../services/householdBookService'

function mergeBooks(owned: HouseholdBook[], participated: HouseholdBook[]): HouseholdBook[] {
  const byId = new Map<string, HouseholdBook>()
  for (const book of [...owned, ...participated]) {
    byId.set(book.id, book)
  }
  return [...byId.values()].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )
}

export function useHouseholdBooks(
  user: { uid: string; email?: string | null } | null | undefined,
  archived: boolean,
  includeParticipated = true,
) {
  const enabled = Boolean(user?.uid)
  const [ownedBooks, setOwnedBooks] = useState<HouseholdBook[]>([])
  const [participatedBooks, setParticipatedBooks] = useState<HouseholdBook[]>([])
  const [syncKey, setSyncKey] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const expectedKey = enabled
    ? `${user!.uid}:${user!.email ?? ''}:${archived}:${includeParticipated}`
    : null
  const loading = enabled && syncKey !== expectedKey

  const books = includeParticipated
    ? mergeBooks(ownedBooks, participatedBooks)
    : ownedBooks

  useEffect(() => {
    if (!user?.uid) return

    let ownedReady = false
    let participatedReady = !includeParticipated || !user.email

    function markReady() {
      if (ownedReady && participatedReady) {
        setSyncKey(`${user!.uid}:${user!.email ?? ''}:${archived}:${includeParticipated}`)
        setError(null)
      }
    }

    const unsubOwned = householdBookService.subscribe(
      user.uid,
      archived,
      (data) => {
        setOwnedBooks(data)
        ownedReady = true
        markReady()
      },
      (err) => {
        setError(err.message)
        ownedReady = true
        participatedReady = true
        setSyncKey(`${user.uid}:${user.email ?? ''}:${archived}:${includeParticipated}`)
      },
    )

    let unsubParticipated = () => {}
    if (includeParticipated && user.email) {
      unsubParticipated = householdBookService.subscribeParticipated(
        user.email,
        archived,
        (data) => {
          setParticipatedBooks(data)
          participatedReady = true
          markReady()
        },
        (err) => {
          setError(err.message)
          ownedReady = true
          participatedReady = true
          setSyncKey(`${user.uid}:${user.email ?? ''}:${archived}:${includeParticipated}`)
        },
      )
    }

    return () => {
      unsubOwned()
      unsubParticipated()
    }
  }, [user?.uid, user?.email, archived, includeParticipated])

  return {
    books: enabled ? books : [],
    loading,
    error: enabled ? error : null,
  }
}
