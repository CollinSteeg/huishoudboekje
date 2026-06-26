import { Timestamp } from 'firebase/firestore'
import { describe, expect, it } from 'vitest'
import {
  currentMonthFilter,
  endOfMonth,
  formatMonthYear,
  parseDateInput,
  startOfMonth,
  toDate,
  toDateInputValue,
} from './dateHelpers'

describe('dateHelpers', () => {
  it('converts Timestamp to Date', () => {
    const date = new Date(2025, 5, 15)
    expect(toDate(Timestamp.fromDate(date))).toEqual(date)
  })

  it('returns start and end of month', () => {
    const filter = { month: 5, year: 2025 }
    expect(startOfMonth(filter)).toEqual(new Date(2025, 5, 1, 0, 0, 0, 0))
    expect(endOfMonth(filter)).toEqual(new Date(2025, 6, 0, 23, 59, 59, 999))
  })

  it('formats month and year in Dutch', () => {
    expect(formatMonthYear({ month: 5, year: 2025 })).toMatch(/juni.*2025/i)
  })

  it('round-trips date input values', () => {
    const date = new Date(2025, 5, 15, 12, 0, 0, 0)
    expect(toDateInputValue(date)).toBe('2025-06-15')
    expect(parseDateInput('2025-06-15')).toEqual(date)
  })

  it('returns current month filter', () => {
    const now = new Date()
    expect(currentMonthFilter()).toEqual({
      month: now.getMonth(),
      year: now.getFullYear(),
    })
  })
})
