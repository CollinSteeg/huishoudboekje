import type { Category, Transaction } from '../types'
import { formatMonthYear } from './dateHelpers'

export interface MonthlyStats {
  label: string
  income: number
  expenses: number
}

export interface CategoryExpense {
  name: string
  amount: number
}

export function groupMonthlyStats(transactions: Transaction[]): MonthlyStats[] {
  const byMonth = new Map<string, { filter: { month: number; year: number }; income: number; expenses: number }>()

  for (const tx of transactions) {
    const month = tx.date.getMonth()
    const year = tx.date.getFullYear()
    const key = `${year}-${month}`

    if (!byMonth.has(key)) {
      byMonth.set(key, { filter: { month, year }, income: 0, expenses: 0 })
    }

    const entry = byMonth.get(key)!
    if (tx.amount > 0) {
      entry.income += tx.amount
    } else if (tx.amount < 0) {
      entry.expenses += Math.abs(tx.amount)
    }
  }

  return [...byMonth.values()]
    .sort((a, b) => {
      const dateA = new Date(a.filter.year, a.filter.month, 1).getTime()
      const dateB = new Date(b.filter.year, b.filter.month, 1).getTime()
      return dateA - dateB
    })
    .map(({ filter, income, expenses }) => ({
      label: formatMonthYear(filter),
      income,
      expenses,
    }))
}

export function groupCategoryExpenses(
  transactions: Transaction[],
  categories: Category[],
): CategoryExpense[] {
  const categoryNames = new Map(categories.map((c) => [c.id, c.name]))
  const byCategory = new Map<string, number>()

  for (const tx of transactions) {
    if (tx.amount >= 0) continue

    const name = tx.categoryId ? (categoryNames.get(tx.categoryId) ?? 'Overig') : 'Overig'
    byCategory.set(name, (byCategory.get(name) ?? 0) + Math.abs(tx.amount))
  }

  return [...byCategory.entries()]
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
}
