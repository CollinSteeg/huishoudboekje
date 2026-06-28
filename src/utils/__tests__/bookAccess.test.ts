import { describe, expect, it } from 'vitest'
import { getBookAccess } from '../bookAccess'
import { createHouseholdBook, createMockUser } from '../../test/helpers'

describe('getBookAccess', () => {
  const owner = createMockUser('user-1', 'owner@example.com')
  const participant = createMockUser('user-2', 'participant@example.com')
  const outsider = createMockUser('user-3', 'outsider@example.com')

  it('grants full access to the owner', () => {
    const book = createHouseholdBook({ ownerId: 'user-1' })
    expect(getBookAccess(book, owner)).toEqual({
      isOwner: true,
      isParticipant: false,
      canRead: true,
      canWrite: true,
    })
  })

  it('grants read-only access to participants', () => {
    const book = createHouseholdBook({
      ownerId: 'user-1',
      participantEmails: ['participant@example.com'],
    })
    expect(getBookAccess(book, participant)).toEqual({
      isOwner: false,
      isParticipant: true,
      canRead: true,
      canWrite: false,
    })
  })

  it('matches participants regardless of email casing and whitespace', () => {
    const book = createHouseholdBook({
      ownerId: 'user-1',
      participantEmails: ['participant@example.com'],
    })
    const participantWithSpaces = createMockUser('user-2', '  Participant@Example.com  ')
    expect(getBookAccess(book, participantWithSpaces)).toEqual({
      isOwner: false,
      isParticipant: true,
      canRead: true,
      canWrite: false,
    })
  })

  it('denies access to non-participants', () => {
    const book = createHouseholdBook({
      ownerId: 'user-1',
      participantEmails: ['participant@example.com'],
    })
    expect(getBookAccess(book, outsider)).toEqual({
      isOwner: false,
      isParticipant: false,
      canRead: false,
      canWrite: false,
    })
  })
})
