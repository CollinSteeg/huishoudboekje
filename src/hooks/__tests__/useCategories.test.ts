import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useCategories } from '../useCategories'
import { createCategory, createTransaction } from '../../test/helpers'

const subscribeMock = vi.fn()
const subscribeAllMock = vi.fn()

vi.mock('../../services/categoryService', () => ({
  categoryService: {
    subscribe: (...args: unknown[]) => subscribeMock(...args),
  },
}))

vi.mock('../../services/transactionService', () => ({
  transactionService: {
    subscribeAll: (...args: unknown[]) => subscribeAllMock(...args),
  },
}))

describe('useCategories', () => {
  it('loads categories enriched with budget info', async () => {
    const categories = [createCategory({ id: 'cat-1', maxBudget: 200 })]
    const transactions = [createTransaction({ categoryId: 'cat-1', amount: -50 })]

    subscribeMock.mockImplementation((_bookId, onData) => {
      onData(categories)
      return vi.fn()
    })
    subscribeAllMock.mockImplementation((_bookId, onData) => {
      onData(transactions)
      return vi.fn()
    })

    const { result } = renderHook(() => useCategories('book-1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.categories).toHaveLength(1)
    expect(result.current.categories[0].spent).toBe(50)
    expect(result.current.plainCategories).toEqual(categories)
  })

  it('returns empty arrays when bookId is undefined', () => {
    const { result } = renderHook(() => useCategories(undefined))
    expect(result.current.categories).toEqual([])
    expect(result.current.loading).toBe(false)
  })
})
