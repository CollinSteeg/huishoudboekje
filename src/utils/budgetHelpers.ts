import type { Category, CategoryWithBudget, Transaction } from '../types'

export function computeBudgetStatus(
  maxBudget: number,
  spent: number,
): 'ok' | 'warning' | 'depleted' | 'over' {
  if (spent > maxBudget) return 'over'
  if (maxBudget > 0 && spent === maxBudget) return 'depleted'
  const remaining = maxBudget - spent
  if (maxBudget > 0 && remaining > 0 && remaining / maxBudget <= 0.2) return 'warning'
  return 'ok'
}

export function enrichCategoriesWithBudget(
  categories: Category[],
  transactions: Transaction[],
): CategoryWithBudget[] {
  return categories.map((category) => {
    const spent = transactions
      .filter((tx) => tx.categoryId === category.id && tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0)

    const remaining = category.maxBudget - spent

    return {
      ...category,
      spent,
      remaining,
      budgetStatus: computeBudgetStatus(category.maxBudget, spent),
    }
  })
}
