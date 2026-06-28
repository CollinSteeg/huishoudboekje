import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { CreateHouseholdBookInput, HouseholdBook } from '../types'
import { normalizeEmail } from '../utils/email'
import { mapHouseholdBook } from './mappers'

const booksCollection = collection(db, 'householdBooks')

export const householdBookService = {
  subscribe(
    ownerId: string,
    archived: boolean,
    callback: (books: HouseholdBook[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const q = query(
      booksCollection,
      where('ownerId', '==', ownerId),
      where('archived', '==', archived),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const books = snapshot.docs.map(mapHouseholdBook)
        books.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        callback(books)
      },
      (error) => onError?.(error),
    )
  },

  subscribeParticipated(
    email: string,
    archived: boolean,
    callback: (books: HouseholdBook[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const normalizedEmail = normalizeEmail(email)
    const q = query(
      booksCollection,
      where('participantEmails', 'array-contains', normalizedEmail),
      where('archived', '==', archived),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        const books = snapshot.docs.map(mapHouseholdBook)
        books.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        callback(books)
      },
      (error) => onError?.(error),
    )
  },

  subscribeById(
    bookId: string,
    callback: (book: HouseholdBook | null) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    return onSnapshot(
      doc(db, 'householdBooks', bookId),
      (snapshot) => {
        if (!snapshot.exists()) {
          callback(null)
          return
        }
        callback(mapHouseholdBook(snapshot))
      },
      (error) => onError?.(error),
    )
  },

  async create(input: CreateHouseholdBookInput, ownerId: string): Promise<string> {
    const docRef = await addDoc(booksCollection, {
      name: input.name.trim(),
      description: input.description?.trim() || '',
      ownerId,
      participantEmails: [],
      archived: false,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  },

  async update(
    bookId: string,
    input: Partial<CreateHouseholdBookInput>,
  ): Promise<void> {
    const updates: Record<string, string> = {}
    if (input.name !== undefined) updates.name = input.name.trim()
    if (input.description !== undefined) {
      updates.description = input.description.trim()
    }
    await updateDoc(doc(db, 'householdBooks', bookId), updates)
  },

  async setArchived(bookId: string, archived: boolean): Promise<void> {
    await updateDoc(doc(db, 'householdBooks', bookId), { archived })
  },

  async addParticipant(bookId: string, email: string): Promise<void> {
    const normalizedEmail = normalizeEmail(email)
    await updateDoc(doc(db, 'householdBooks', bookId), {
      participantEmails: arrayUnion(normalizedEmail),
    })
  },

  async removeParticipant(bookId: string, email: string): Promise<void> {
    const normalizedEmail = normalizeEmail(email)
    await updateDoc(doc(db, 'householdBooks', bookId), {
      participantEmails: arrayRemove(normalizedEmail),
    })
  },

  async leaveBook(bookId: string, email: string): Promise<void> {
    await this.removeParticipant(bookId, email)
  },
}
