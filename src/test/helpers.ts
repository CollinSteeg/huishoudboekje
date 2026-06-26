import type { Category, CategoryWithBudget, HouseholdBook, Transaction } from '../types'

export function createHouseholdBook(overrides: Partial<HouseholdBook> = {}): HouseholdBook {
  return {
    id: 'book-1',
    name: 'Test Boekje',
    description: 'Test omschrijving',
    ownerId: 'user-1',
    archived: false,
    createdAt: new Date('2025-01-01'),
    ...overrides,
  }
}

export function createTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: 'tx-1',
    amount: -50,
    description: 'Boodschappen',
    date: new Date('2025-06-15'),
    categoryId: 'cat-1',
    createdAt: new Date('2025-06-15'),
    ...overrides,
  }
}

export function createCategory(overrides: Partial<Category> = {}): Category {
  return {
    id: 'cat-1',
    name: 'Boodschappen',
    maxBudget: 500,
    endDate: null,
    createdAt: new Date('2025-01-01'),
    ...overrides,
  }
}

export function createCategoryWithBudget(
  overrides: Partial<CategoryWithBudget> = {},
): CategoryWithBudget {
  return {
    ...createCategory(),
    spent: 100,
    remaining: 400,
    budgetStatus: 'ok',
    ...overrides,
  }
}

export function createMockUser(uid = 'user-1', email = 'test@example.com') {
  return { uid, email } as { uid: string; email: string }
}
