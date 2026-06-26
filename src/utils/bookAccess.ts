import type { HouseholdBook } from '../types'

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
    book.participantEmails.includes(user.email.toLowerCase())
  return {
    isOwner,
    isParticipant,
    canRead: isOwner || isParticipant,
    canWrite: isOwner,
  }
}
