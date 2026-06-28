import { describe, expect, it } from 'vitest'
import { computeBudgetStatus, enrichCategoriesWithBudget } from '../budgetHelpers'
import { createCategory, createTransaction } from '../../test/helpers'

describe('computeBudgetStatus', () => {
  it('returns ok when plenty of budget remains', () => {
    expect(computeBudgetStatus(100, 50)).toBe('ok')
  })

  it('returns warning when 20% or less budget remains', () => {
    expect(computeBudgetStatus(100, 85)).toBe('warning')
    expect(computeBudgetStatus(100, 80)).toBe('warning')
  })

  it('returns over when spent exceeds max budget', () => {
    expect(computeBudgetStatus(100, 150)).toBe('over')
  })
})

describe('enrichCategoriesWithBudget', () => {
  it('calculates spent, remaining and status from expense transactions', () => {
    const category = createCategory({ id: 'cat-1', maxBudget: 200 })
    const transactions = [
      createTransaction({ categoryId: 'cat-1', amount: -50 }),
      createTransaction({ id: 'tx-2', categoryId: 'cat-1', amount: -30 }),
      createTransaction({ id: 'tx-3', categoryId: 'cat-1', amount: 100 }),
    ]

    const result = enrichCategoriesWithBudget([category], transactions)

    expect(result).toHaveLength(1)
    expect(result[0].spent).toBe(80)
    expect(result[0].remaining).toBe(120)
    expect(result[0].budgetStatus).toBe('ok')
  })
})
