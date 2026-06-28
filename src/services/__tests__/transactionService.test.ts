import { describe, expect, it, vi } from 'vitest'

const addDocMock = vi.fn()
const updateDocMock = vi.fn()
const deleteDocMock = vi.fn()
const onSnapshotMock = vi.fn()
const queryMock = vi.fn((...args: unknown[]) => args)
const collectionMock = vi.fn(() => 'transactions-collection')
const docMock = vi.fn(() => 'transaction-doc')
const orderByMock = vi.fn()
const whereMock = vi.fn()

vi.mock('firebase/firestore', () => ({
  Timestamp: {
    now: () => ({ seconds: 1 }),
    fromDate: (date: Date) => ({ toDate: () => date }),
  },
  addDoc: (...args: unknown[]) => addDocMock(...args),
  updateDoc: (...args: unknown[]) => updateDocMock(...args),
  deleteDoc: (...args: unknown[]) => deleteDocMock(...args),
  onSnapshot: (...args: unknown[]) => onSnapshotMock(...args),
  query: (...args: unknown[]) => queryMock(...args),
  collection: (...args: unknown[]) => collectionMock(...args),
  doc: (...args: unknown[]) => docMock(...args),
  orderBy: (...args: unknown[]) => orderByMock(...args),
  where: (...args: unknown[]) => whereMock(...args),
}))

vi.mock('../../lib/firebase', () => ({ db: {} }))

import { transactionService } from '../transactionService'

describe('transactionService', () => {
  it('subscribes to monthly transactions', () => {
    const callback = vi.fn()
    onSnapshotMock.mockImplementation((_q, onData) => {
      onData({ docs: [] })
      return vi.fn()
    })

    transactionService.subscribe('book-1', { month: 5, year: 2025 }, callback)
    expect(callback).toHaveBeenCalledWith([])
  })

  it('creates a transaction with default date', async () => {
    addDocMock.mockResolvedValue({ id: 'tx-new' })
    const id = await transactionService.create('book-1', { amount: -25 })
    expect(id).toBe('tx-new')
    expect(addDocMock).toHaveBeenCalledOnce()
  })

  it('updates a transaction', async () => {
    await transactionService.update('book-1', 'tx-1', { amount: -30 })
    expect(updateDocMock).toHaveBeenCalledOnce()
  })

  it('deletes a transaction', async () => {
    await transactionService.delete('book-1', 'tx-1')
    expect(deleteDocMock).toHaveBeenCalledOnce()
  })
})
