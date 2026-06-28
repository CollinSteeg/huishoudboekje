import { describe, expect, it } from 'vitest'
import { formatCurrency } from '../formatCurrency'

describe('formatCurrency', () => {
  it('formats amounts as EUR in Dutch locale', () => {
    expect(formatCurrency(1234.56)).toMatch(/1\.234,56/)
    expect(formatCurrency(1234.56)).toContain('€')
  })

  it('formats negative amounts', () => {
    expect(formatCurrency(-50)).toMatch(/50/)
  })
})
