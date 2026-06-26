import { describe, expect, it } from 'vitest'
import { createCategory, createTransaction } from '../test/helpers'
import { groupCategoryExpenses, groupMonthlyStats } from './chartHelpers'

describe('groupMonthlyStats', () => {
  it('groups income and expenses per month sorted chronologically', () => {
    const transactions = [
      createTransaction({ amount: 1000, date: new Date('2025-05-10') }),
      createTransaction({ id: 'tx-2', amount: -200, date: new Date('2025-05-20') }),
      createTransaction({ id: 'tx-3', amount: 500, date: new Date('2025-06-05') }),
      createTransaction({ id: 'tx-4', amount: -100, date: new Date('2025-06-15') }),
    ]

    const result = groupMonthlyStats(transactions)

    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ income: 1000, expenses: 200 })
    expect(result[1]).toMatchObject({ income: 500, expenses: 100 })
    expect(result[0].label).toContain('2025')
    expect(result[1].label).toContain('2025')
  })

  it('returns empty array when there are no transactions', () => {
    expect(groupMonthlyStats([])).toEqual([])
  })
})

describe('groupCategoryExpenses', () => {
  it('sums expenses per category and sorts by amount descending', () => {
    const categories = [
      createCategory({ id: 'cat-1', name: 'Boodschappen' }),
      createCategory({ id: 'cat-2', name: 'Vervoer' }),
    ]
    const transactions = [
      createTransaction({ amount: -50, categoryId: 'cat-1' }),
      createTransaction({ id: 'tx-2', amount: -30, categoryId: 'cat-2' }),
      createTransaction({ id: 'tx-3', amount: -20, categoryId: 'cat-1' }),
      createTransaction({ id: 'tx-4', amount: 100, categoryId: 'cat-1' }),
    ]

    const result = groupCategoryExpenses(transactions, categories)

    expect(result).toEqual([
      { name: 'Boodschappen', amount: 70 },
      { name: 'Vervoer', amount: 30 },
    ])
  })

  it('labels uncategorized expenses as Overig', () => {
    const transactions = [
      createTransaction({ amount: -25, categoryId: null }),
      createTransaction({ id: 'tx-2', amount: -15, categoryId: undefined }),
    ]

    const result = groupCategoryExpenses(transactions, [])

    expect(result).toEqual([{ name: 'Overig', amount: 40 }])
  })

  it('returns empty array when there are no expenses', () => {
    const transactions = [createTransaction({ amount: 100 })]

    expect(groupCategoryExpenses(transactions, [createCategory()])).toEqual([])
  })
})
