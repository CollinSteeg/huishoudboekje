import { describe, expect, it } from 'vitest'
import { normalizeEmail } from '../email'

describe('normalizeEmail', () => {
  it('lowercases and trims email addresses', () => {
    expect(normalizeEmail('  User@Example.com  ')).toBe('user@example.com')
  })

  it('leaves already normalized emails unchanged', () => {
    expect(normalizeEmail('user@example.com')).toBe('user@example.com')
  })
})
