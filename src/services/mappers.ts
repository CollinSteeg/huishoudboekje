import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import type { Category, HouseholdBook, Transaction } from '../types'
import { toDate } from '../utils/dateHelpers'

export function mapHouseholdBook(
  doc: QueryDocumentSnapshot<DocumentData>,
): HouseholdBook {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    ownerId: data.ownerId,
    archived: data.archived ?? false,
    createdAt: toDate(data.createdAt),
  }
}

export function mapTransaction(
  doc: QueryDocumentSnapshot<DocumentData>,
): Transaction {
  const data = doc.data()
  return {
    id: doc.id,
    amount: data.amount,
    description: data.description,
    date: toDate(data.date),
    categoryId: data.categoryId ?? null,
    createdAt: toDate(data.createdAt),
  }
}

export function mapCategory(
  doc: QueryDocumentSnapshot<DocumentData>
): Category {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name,
    maxBudget: data.maxBudget,
    endDate: data.endDate ? toDate(data.endDate) : null,
    createdAt: toDate(data.createdAt),
  }
}

export function toTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date)
}
