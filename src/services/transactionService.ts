import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { CreateTransactionInput, MonthFilter, Transaction } from '../types'
import { endOfMonth, startOfMonth } from '../utils/dateHelpers'
import { mapTransaction, toTimestamp } from './mappers'

export const transactionService = {
  subscribe(
    bookId: string,
    filter: MonthFilter,
    callback: (transactions: Transaction[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const q = query(
      collection(db, 'householdBooks', bookId, 'transactions'),
      where('date', '>=', toTimestamp(startOfMonth(filter))),
      where('date', '<=', toTimestamp(endOfMonth(filter))),
      orderBy('date', 'desc'),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map(mapTransaction))
      },
      (error) => onError?.(error),
    )
  },

  subscribeAll(
    bookId: string,
    callback: (transactions: Transaction[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const q = query(
      collection(db, 'householdBooks', bookId, 'transactions'),
      orderBy('date', 'desc'),
    )

    return onSnapshot(
      q,
      (snapshot) => {
        callback(snapshot.docs.map(mapTransaction))
      },
      (error) => onError?.(error),
    )
  },

  async create(bookId: string, input: CreateTransactionInput): Promise<string> {
    const date = input.date ?? new Date()
    const docRef = await addDoc(
      collection(db, 'householdBooks', bookId, 'transactions'),
      {
        amount: input.amount,
        description: input.description?.trim() || '',
        date: toTimestamp(date),
        categoryId: input.categoryId ?? null,
        createdAt: Timestamp.now(),
      },
    )
    return docRef.id
  },

  async update(
    bookId: string,
    transactionId: string,
    input: Partial<CreateTransactionInput>,
  ): Promise<void> {
    const updates: Record<string, unknown> = {}
    if (input.amount !== undefined) updates.amount = input.amount
    if (input.description !== undefined) {
      updates.description = input.description.trim()
    }
    if (input.date !== undefined) updates.date = toTimestamp(input.date)
    if (input.categoryId !== undefined) updates.categoryId = input.categoryId

    await updateDoc(
      doc(db, 'householdBooks', bookId, 'transactions', transactionId),
      updates,
    )
  },

  async delete(bookId: string, transactionId: string): Promise<void> {
    await deleteDoc(
      doc(db, 'householdBooks', bookId, 'transactions', transactionId),
    )
  },
}
