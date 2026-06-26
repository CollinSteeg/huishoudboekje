import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useAuth } from './useAuth'

const onAuthStateChangedMock = vi.fn()

vi.mock('../services/authService', () => ({
  authService: {
    onAuthStateChanged: (cb: (user: unknown) => void) => {
      onAuthStateChangedMock(cb)
      return vi.fn()
    },
  },
}))

describe('useAuth', () => {
  it('returns user after auth state resolves', async () => {
    const mockUser = { uid: 'user-1', email: 'test@example.com' }
    const { result } = renderHook(() => useAuth())

    expect(result.current.loading).toBe(true)

    onAuthStateChangedMock.mock.calls[0][0](mockUser)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.user).toEqual(mockUser)
    })
  })
})
