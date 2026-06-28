import { Timestamp } from 'firebase/firestore'
import { describe, expect, it, vi } from 'vitest'

const {
  addDocMock,
  updateDocMock,
  onSnapshotMock,
  queryMock,
  collectionMock,
  docMock,
  whereMock,
  arrayUnionMock,
  arrayRemoveMock,
} = vi.hoisted(() => ({
  addDocMock: vi.fn(),
  updateDocMock: vi.fn(),
  onSnapshotMock: vi.fn(),
  queryMock: vi.fn((...args: unknown[]) => args),
  collectionMock: vi.fn(() => 'books-collection'),
  docMock: vi.fn(() => 'book-doc'),
  whereMock: vi.fn(),
  arrayUnionMock: vi.fn((value: unknown) => value),
  arrayRemoveMock: vi.fn((value: unknown) => value),
}))

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>()
  return {
    ...actual,
    addDoc: (...args: unknown[]) => addDocMock(...args),
    updateDoc: (...args: unknown[]) => updateDocMock(...args),
    onSnapshot: (...args: unknown[]) => onSnapshotMock(...args),
    query: (...args: unknown[]) => queryMock(...args),
    collection: (...args: unknown[]) => collectionMock(...args),
    doc: (...args: unknown[]) => docMock(...args),
    where: (...args: unknown[]) => whereMock(...args),
    arrayUnion: (...args: unknown[]) => arrayUnionMock(...args),
    arrayRemove: (...args: unknown[]) => arrayRemoveMock(...args),
  }
})

vi.mock('../../lib/firebase', () => ({ db: {} }))

import { householdBookService } from '../householdBookService'

function mockBookDoc(id: string, createdAt: Date) {
  return {
    id,
    data: () => ({
      name: 'Boekje',
      description: '',
      ownerId: 'user-1',
      participantEmails: [],
      archived: false,
      createdAt: Timestamp.fromDate(createdAt),
    }),
  }
}

describe('householdBookService', () => {
  it('subscribes to books and sorts by createdAt desc', () => {
    const callback = vi.fn()
    onSnapshotMock.mockImplementation((_q, onData) => {
      onData({
        docs: [
          mockBookDoc('old', new Date('2024-01-01')),
          mockBookDoc('new', new Date('2025-01-01')),
        ],
      })
      return vi.fn()
    })

    householdBookService.subscribe('user-1', false, callback)
    expect(callback).toHaveBeenCalledOnce()
    expect(callback.mock.calls[0][0][0].id).toBe('new')
  })

  it('creates a book with owner id', async () => {
    addDocMock.mockResolvedValue({ id: 'book-new' })
    const id = await householdBookService.create({ name: 'Gezin' }, 'user-1')
    expect(id).toBe('book-new')
    expect(addDocMock).toHaveBeenCalledWith(
      'books-collection',
      expect.objectContaining({
        name: 'Gezin',
        ownerId: 'user-1',
        participantEmails: [],
        archived: false,
      }),
    )
  })

  it('adds and removes participants by normalized email', async () => {
    await householdBookService.addParticipant('book-1', 'User@Example.com')
    expect(arrayUnionMock).toHaveBeenCalledWith('user@example.com')
    expect(updateDocMock).toHaveBeenCalledWith('book-doc', {
      participantEmails: 'user@example.com',
    })

    await householdBookService.removeParticipant('book-1', 'User@Example.com')
    expect(arrayRemoveMock).toHaveBeenCalledWith('user@example.com')
  })

  it('lets a participant leave a book via removeParticipant', async () => {
    await householdBookService.leaveBook('book-1', 'User@Example.com')
    expect(arrayRemoveMock).toHaveBeenCalledWith('user@example.com')
  })

  it('archives and restores a book', async () => {
    await householdBookService.setArchived('book-1', true)
    expect(updateDocMock).toHaveBeenCalledWith('book-doc', { archived: true })
  })
})
