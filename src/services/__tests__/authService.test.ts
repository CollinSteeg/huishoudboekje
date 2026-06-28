import { describe, expect, it, vi } from 'vitest'

const signInMock = vi.fn()
const signUpMock = vi.fn()
const signOutMock = vi.fn()
const onAuthStateChangedMock = vi.fn()

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) => signUpMock(...args),
  signInWithEmailAndPassword: (...args: unknown[]) => signInMock(...args),
  signOut: (...args: unknown[]) => signOutMock(...args),
  onAuthStateChanged: (...args: unknown[]) => onAuthStateChangedMock(...args),
}))

vi.mock('../../lib/firebase', () => ({
  auth: { currentUser: { uid: 'user-1' } },
}))

import { authService } from '../authService'

describe('authService', () => {
  it('signs in with email and password', async () => {
    signInMock.mockResolvedValue({ user: { uid: 'user-1' } })
    await authService.signIn('test@example.com', 'secret')
    expect(signInMock).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'secret')
  })

  it('signs up with email and password', async () => {
    signUpMock.mockResolvedValue({ user: { uid: 'user-1' } })
    await authService.signUp('test@example.com', 'secret')
    expect(signUpMock).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'secret')
  })

  it('signs out', async () => {
    signOutMock.mockResolvedValue(undefined)
    await authService.signOut()
    expect(signOutMock).toHaveBeenCalledOnce()
  })

  it('returns current user', () => {
    expect(authService.getCurrentUser()?.uid).toBe('user-1')
  })
})
