import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Category, CreateCategoryInput } from '../types'
import { mapCategory, toTimestamp } from './mappers'

export const categoryService = {
  subscribe(
    bookId: string,
    callback: (categories: Category[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const q = query(
      collection(db, 'householdBooks', bookId, 'categories'),
      orderBy('name', 'asc'),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map(mapCategory))
      },
      (error) => onError?.(error),
    )
  },

  async create(bookId: string, input: CreateCategoryInput): Promise<string> {
    const docRef = await addDoc(
      collection(db, 'householdBooks', bookId, 'categories'),
      {
        name: input.name.trim(),
        maxBudget: input.maxBudget,
        endDate: input.endDate ? toTimestamp(input.endDate) : null,
        createdAt: Timestamp.now(),
      },
    )
    return docRef.id
  },

  async update(
    bookId: string,
    categoryId: string,
    input: Partial<CreateCategoryInput>,
  ): Promise<void> {
    const updates: Record<string, unknown> = {}
    if (input.name !== undefined) updates.name = input.name.trim()
    if (input.maxBudget !== undefined) updates.maxBudget = input.maxBudget
    if (input.endDate !== undefined) {
      updates.endDate = input.endDate ? toTimestamp(input.endDate) : null
    }

    await updateDoc(
      doc(db, 'householdBooks', bookId, 'categories', categoryId),
      updates,
    )
  },

  async delete(bookId: string, categoryId: string): Promise<void> {
    await deleteDoc(doc(db, 'householdBooks', bookId, 'categories', categoryId))
  },
}
