import { describe, expect, it, vi } from 'vitest'

const addDocMock = vi.fn()
const updateDocMock = vi.fn()
const deleteDocMock = vi.fn()
const onSnapshotMock = vi.fn()
const queryMock = vi.fn((...args: unknown[]) => args)
const collectionMock = vi.fn(() => 'categories-collection')
const docMock = vi.fn(() => 'category-doc')
const orderByMock = vi.fn()

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
}))

vi.mock('../lib/firebase', () => ({ db: {} }))

import { categoryService } from './categoryService'

describe('categoryService', () => {
  it('subscribes to categories', () => {
    const callback = vi.fn()
    const unsubscribe = vi.fn()
    onSnapshotMock.mockImplementation((_q, onData) => {
      onData({ docs: [] })
      return unsubscribe
    })

    const result = categoryService.subscribe('book-1', callback)
    expect(callback).toHaveBeenCalledWith([])
    expect(result).toBe(unsubscribe)
  })

  it('creates a category', async () => {
    addDocMock.mockResolvedValue({ id: 'cat-new' })
    const id = await categoryService.create('book-1', {
      name: 'Boodschappen',
      maxBudget: 300,
      endDate: null,
    })
    expect(id).toBe('cat-new')
    expect(addDocMock).toHaveBeenCalledOnce()
  })

  it('updates a category', async () => {
    await categoryService.update('book-1', 'cat-1', { name: 'Sport' })
    expect(updateDocMock).toHaveBeenCalledOnce()
  })

  it('deletes a category', async () => {
    await categoryService.delete('book-1', 'cat-1')
    expect(deleteDocMock).toHaveBeenCalledOnce()
  })
})
