import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BookForm } from './BookForm'

describe('BookForm', () => {
  it('submits name and description', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<BookForm onSubmit={onSubmit} />)

    await user.type(screen.getByPlaceholderText('Bijv. Gezinsbudget'), 'Gezin')
    await user.type(screen.getByPlaceholderText('Optionele omschrijving'), 'Ons budget')
    await user.click(screen.getByRole('button', { name: 'Opslaan' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Gezin', description: 'Ons budget' })
    })
  })

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup()
    render(<BookForm onSubmit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Opslaan' }))
    expect(screen.getByText('Naam is verplicht')).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    render(<BookForm onSubmit={vi.fn()} onCancel={onCancel} />)
    await user.click(screen.getByRole('button', { name: 'Annuleren' }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
