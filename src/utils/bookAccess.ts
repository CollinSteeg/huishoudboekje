import type { HouseholdBook } from '../types'
import { normalizeEmail } from './email'

export interface BookAccess {
  isOwner: boolean
  isParticipant: boolean
  canRead: boolean
  canWrite: boolean
}

export function getBookAccess(
  book: HouseholdBook,
  user: { uid: string; email?: string | null },
): BookAccess {
  const isOwner = book.ownerId === user.uid
  const isParticipant =
    !isOwner &&
    !!user.email &&
    book.participantEmails.includes(normalizeEmail(user.email))
  return {
    isOwner,
    isParticipant,
    canRead: isOwner || isParticipant,
    canWrite: isOwner,
  }
}
