import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useHouseholdBook } from '../useHouseholdBook'
import { createHouseholdBook } from '../../test/helpers'

const subscribeByIdMock = vi.fn()

vi.mock('../../services/householdBookService', () => ({
  householdBookService: {
    subscribeById: (...args: unknown[]) => subscribeByIdMock(...args),
  },
}))

describe('useHouseholdBook', () => {
  it('loads a household book by id', async () => {
    const book = createHouseholdBook()
    subscribeByIdMock.mockImplementation((_bookId, onData) => {
      onData(book)
      return vi.fn()
    })

    const { result } = renderHook(() => useHouseholdBook('book-1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.book).toEqual(book)
    expect(result.current.error).toBeNull()
  })

  it('returns null when bookId is undefined', () => {
    const { result } = renderHook(() => useHouseholdBook(undefined))
    expect(result.current.book).toBeNull()
    expect(result.current.loading).toBe(false)
  })
})
