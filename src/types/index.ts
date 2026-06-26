export interface HouseholdBook {
  id: string
  name: string
  description?: string
  ownerId: string
  participantEmails: string[]
  archived: boolean
  createdAt: Date
}

export interface Transaction {
  id: string
  amount: number
  description?: string
  date: Date
  categoryId?: string | null
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  maxBudget: number
  endDate?: Date | null
  createdAt: Date
}

export interface CategoryWithBudget extends Category {
  spent: number
  remaining: number
  budgetStatus: 'ok' | 'warning' | 'over'
}

export interface MonthFilter {
  month: number
  year: number
}

export interface CreateHouseholdBookInput {
  name: string
  description?: string
}

export interface CreateTransactionInput {
  amount: number
  description?: string
  date?: Date
  categoryId?: string | null
}

export interface CreateCategoryInput {
  name: string
  maxBudget: number
  endDate?: Date | null
}
