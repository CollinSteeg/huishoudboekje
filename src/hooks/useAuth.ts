import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { authService } from '../services/authService'
import { userEmailService } from '../services/userEmailService'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
      setLoading(false)
      if (currentUser?.email) {
        void userEmailService.register(currentUser.email, currentUser.uid)
      }
    })
    return unsubscribe
  }, [])

  return { user, loading }
}
