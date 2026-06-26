import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useHouseholdBooks } from './useHouseholdBooks'
import { createHouseholdBook } from '../test/helpers'

const subscribeMock = vi.fn()

vi.mock('../services/householdBookService', () => ({
  householdBookService: {
    subscribe: (...args: unknown[]) => subscribeMock(...args),
  },
}))

describe('useHouseholdBooks', () => {
  it('loads books for owner filtered by archived state', async () => {
    const books = [createHouseholdBook()]
    subscribeMock.mockImplementation((_ownerId, archived, onData) => {
      expect(archived).toBe(false)
      onData(books)
      return vi.fn()
    })

    const { result } = renderHook(() => useHouseholdBooks('user-1', false))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.books).toEqual(books)
  })

  it('returns empty list when ownerId is undefined', () => {
    const { result } = renderHook(() => useHouseholdBooks(undefined, false))
    expect(result.current.books).toEqual([])
    expect(result.current.loading).toBe(false)
  })
})
