import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

export const userEmailService = {
  async register(email: string, uid: string): Promise<void> {
    const normalized = normalizeEmail(email)
    await setDoc(doc(db, 'userEmails', normalized), { uid })
  },

  async lookup(email: string): Promise<string | null> {
    const normalized = normalizeEmail(email)
    const snapshot = await getDoc(doc(db, 'userEmails', normalized))
    if (!snapshot.exists()) return null
    return snapshot.data().uid as string
  },
}
