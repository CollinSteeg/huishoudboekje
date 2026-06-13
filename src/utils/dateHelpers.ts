import { Timestamp } from 'firebase/firestore'
import type { MonthFilter } from '../types'

export function toDate(value: Date | Timestamp): Date {
  return value instanceof Timestamp ? value.toDate() : value
}

export function startOfMonth(filter: MonthFilter): Date {
  return new Date(filter.year, filter.month, 1, 0, 0, 0, 0)
}

export function endOfMonth(filter: MonthFilter): Date {
  return new Date(filter.year, filter.month + 1, 0, 23, 59, 59, 999)
}

export function currentMonthFilter(): MonthFilter {
  const now = new Date()
  return { month: now.getMonth(), year: now.getFullYear() }
}

export function formatMonthYear(filter: MonthFilter): string {
  const date = new Date(filter.year, filter.month, 1)
  return new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(date)
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateInput(value: string): Date {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day, 12, 0, 0, 0)
}
