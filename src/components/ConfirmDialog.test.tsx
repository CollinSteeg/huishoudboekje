import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './ConfirmDialog'

describe('ConfirmDialog', () => {
  it('renders message and action buttons', () => {
    render(
      <ConfirmDialog
        open
        title="Verwijderen"
        message="Weet je het zeker?"
        confirmLabel="Ja, verwijder"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(screen.getByText('Weet je het zeker?')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ja, verwijder' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Annuleren' })).toBeInTheDocument()
  })

  it('calls onConfirm and onCancel', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmDialog
        open
        title="Test"
        message="Bericht"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Bevestigen' }))
    await user.click(screen.getByRole('button', { name: 'Annuleren' }))
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onCancel).toHaveBeenCalledOnce()
  })

  it('shows loading state', () => {
    render(
      <ConfirmDialog
        open
        title="Test"
        message="Bericht"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        loading
      />,
    )
    expect(screen.getByRole('button', { name: 'Bezig...' })).toBeDisabled()
  })
})
