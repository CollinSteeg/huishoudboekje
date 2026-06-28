import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAllTransactions, useTransactions } from '../useTransactions'
import { createTransaction } from '../../test/helpers'

const subscribeMock = vi.fn()
const subscribeAllMock = vi.fn()

vi.mock('../../services/transactionService', () => ({
  transactionService: {
    subscribe: (...args: unknown[]) => subscribeMock(...args),
    subscribeAll: (...args: unknown[]) => subscribeAllMock(...args),
  },
}))

describe('useTransactions', () => {
  it('loads transactions for a month filter', async () => {
    const transactions = [createTransaction()]
    subscribeMock.mockImplementation((_bookId, _filter, onData) => {
      onData(transactions)
      return vi.fn()
    })

    const { result } = renderHook(() =>
      useTransactions('book-1', { month: 5, year: 2025 }),
    )

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.transactions).toEqual(transactions)
  })
})

describe('useAllTransactions', () => {
  it('loads all transactions for a book', async () => {
    const transactions = [createTransaction(), createTransaction({ id: 'tx-2' })]
    subscribeAllMock.mockImplementation((_bookId, onData) => {
      onData(transactions)
      return vi.fn()
    })

    const { result } = renderHook(() => useAllTransactions('book-1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.transactions).toHaveLength(2)
  })
})
