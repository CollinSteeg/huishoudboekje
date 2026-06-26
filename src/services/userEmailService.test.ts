import { describe, expect, it, vi } from 'vitest'

const { setDocMock, getDocMock, docMock } = vi.hoisted(() => ({
  setDocMock: vi.fn(),
  getDocMock: vi.fn(),
  docMock: vi.fn((...args: unknown[]) => args),
}))

vi.mock('firebase/firestore', () => ({
  doc: (...args: unknown[]) => docMock(...args),
  setDoc: (...args: unknown[]) => setDocMock(...args),
  getDoc: (...args: unknown[]) => getDocMock(...args),
}))

vi.mock('../lib/firebase', () => ({ db: {} }))

import { userEmailService } from './userEmailService'

describe('userEmailService', () => {
  it('registers email with normalized document id', async () => {
    await userEmailService.register('User@Example.com', 'user-1')
    expect(docMock).toHaveBeenCalledWith({}, 'userEmails', 'user@example.com')
    expect(setDocMock).toHaveBeenCalledWith(
      [{}, 'userEmails', 'user@example.com'],
      { uid: 'user-1' },
    )
  })

  it('looks up uid by normalized email', async () => {
    getDocMock.mockResolvedValue({
      exists: () => true,
      data: () => ({ uid: 'user-2' }),
    })

    const uid = await userEmailService.lookup('User@Example.com')
    expect(uid).toBe('user-2')
  })

  it('returns null when email is not registered', async () => {
    getDocMock.mockResolvedValue({ exists: () => false })
    const uid = await userEmailService.lookup('missing@example.com')
    expect(uid).toBeNull()
  })
})
