import { Timestamp } from 'firebase/firestore'
import { describe, expect, it } from 'vitest'
import { mapCategory, mapHouseholdBook, mapTransaction, toTimestamp } from './mappers'

function mockDoc(id: string, data: Record<string, unknown>) {
  return {
    id,
    data: () => data,
  }
}

describe('mappers', () => {
  const createdAt = Timestamp.fromDate(new Date('2025-01-01'))

  it('maps household book documents', () => {
    const book = mapHouseholdBook(
      mockDoc('book-1', {
        name: 'Gezin',
        description: 'Test',
        ownerId: 'user-1',
        archived: false,
        createdAt,
      }) as never,
    )

    expect(book).toEqual({
      id: 'book-1',
      name: 'Gezin',
      description: 'Test',
      ownerId: 'user-1',
      participantEmails: [],
      archived: false,
      createdAt: createdAt.toDate(),
    })
  })

  it('maps transaction documents', () => {
    const date = Timestamp.fromDate(new Date('2025-06-15'))
    const tx = mapTransaction(
      mockDoc('tx-1', {
        amount: -25,
        description: 'Lunch',
        date,
        categoryId: 'cat-1',
        createdAt,
      }) as never,
    )

    expect(tx.id).toBe('tx-1')
    expect(tx.amount).toBe(-25)
    expect(tx.date).toEqual(date.toDate())
    expect(tx.categoryId).toBe('cat-1')
  })

  it('maps category documents', () => {
    const endDate = Timestamp.fromDate(new Date('2025-12-31'))
    const category = mapCategory(
      mockDoc('cat-1', {
        name: 'Boodschappen',
        maxBudget: 300,
        endDate,
        createdAt,
      }) as never,
    )

    expect(category.name).toBe('Boodschappen')
    expect(category.maxBudget).toBe(300)
    expect(category.endDate).toEqual(endDate.toDate())
  })

  it('converts Date to Timestamp', () => {
    const date = new Date('2025-06-15')
    expect(toTimestamp(date).toDate()).toEqual(date)
  })
})
