import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useHouseholdBooks } from './useHouseholdBooks'
import { createHouseholdBook } from '../test/helpers'

const subscribeMock = vi.fn()
const subscribeParticipatedMock = vi.fn()

vi.mock('../services/householdBookService', () => ({
  householdBookService: {
    subscribe: (...args: unknown[]) => subscribeMock(...args),
    subscribeParticipated: (...args: unknown[]) => subscribeParticipatedMock(...args),
  },
}))

describe('useHouseholdBooks', () => {
  it('merges owned and participated books', async () => {
    const owned = [createHouseholdBook({ id: 'owned', name: 'Eigen boekje' })]
    const participated = [
      createHouseholdBook({
        id: 'shared',
        name: 'Gedeeld boekje',
        ownerId: 'user-2',
        participantEmails: ['test@example.com'],
      }),
    ]

    subscribeMock.mockImplementation((_uid, archived, onData) => {
      expect(archived).toBe(false)
      onData(owned)
      return vi.fn()
    })
    subscribeParticipatedMock.mockImplementation((_email, archived, onData) => {
      expect(archived).toBe(false)
      onData(participated)
      return vi.fn()
    })

    const { result } = renderHook(() =>
      useHouseholdBooks({ uid: 'user-1', email: 'test@example.com' }, false),
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.books).toHaveLength(2)
    expect(result.current.books.map((book) => book.id)).toEqual(['owned', 'shared'])
  })

  it('returns empty list when user is undefined', () => {
    const { result } = renderHook(() => useHouseholdBooks(undefined, false))
    expect(result.current.books).toEqual([])
    expect(result.current.loading).toBe(false)
  })
})
