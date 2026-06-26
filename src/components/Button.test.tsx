import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children with variant class', () => {
    render(<Button variant="danger">Verwijderen</Button>)
    const button = screen.getByRole('button', { name: 'Verwijderen' })
    expect(button).toHaveClass('btn--danger')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Klik</Button>)
    await user.click(screen.getByRole('button', { name: 'Klik' }))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
