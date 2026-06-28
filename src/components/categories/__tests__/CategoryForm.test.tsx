import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CategoryForm } from '../CategoryForm'
import { createCategory } from '../../../test/helpers'

describe('CategoryForm', () => {
  it('submits category with name and budget', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<CategoryForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Naam'), 'Vakantie')
    await user.type(screen.getByLabelText('Maximaal budget'), '1000')
    await user.click(screen.getByRole('button', { name: 'Opslaan' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Vakantie', maxBudget: 1000, endDate: null }),
      )
    })
  })

  it('pre-fills initial values when editing', () => {
    const category = createCategory({ name: 'Sport', maxBudget: 200 })
    render(<CategoryForm initial={category} onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Naam')).toHaveValue('Sport')
    expect(screen.getByLabelText('Maximaal budget')).toHaveValue(200)
  })

  it('shows validation error for missing name', () => {
    render(<CategoryForm onSubmit={vi.fn()} />)
    fireEvent.submit(screen.getByRole('button', { name: 'Opslaan' }).closest('form')!)
    expect(screen.getByText('Naam is verplicht')).toBeInTheDocument()
  })
})
