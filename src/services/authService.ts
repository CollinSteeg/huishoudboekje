import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export const authService = {
  signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password)
  },

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  },

  signOut() {
    return signOut(auth)
  },

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback)
  },

  getCurrentUser() {
    return auth.currentUser
  },
}
