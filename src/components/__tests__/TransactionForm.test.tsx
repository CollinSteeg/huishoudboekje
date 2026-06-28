import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TransactionForm } from '../TransactionForm'
import { createCategory, createTransaction } from '../../test/helpers'

describe('TransactionForm', () => {
  const categories = [createCategory({ id: 'cat-1', name: 'Boodschappen' })]

  it('submits expense with negative amount', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TransactionForm categories={categories} onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Bedrag'), '25')
    await user.click(screen.getByRole('button', { name: 'Opslaan' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: -25,
          categoryId: null,
        }),
      )
    })
  })

  it('submits income with positive amount', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TransactionForm categories={categories} onSubmit={onSubmit} />)

    await user.selectOptions(screen.getByLabelText('Type'), 'income')
    await user.type(screen.getByLabelText('Bedrag'), '500')
    await user.click(screen.getByRole('button', { name: 'Opslaan' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ amount: 500 }))
    })
  })

  it('pre-fills values when editing', () => {
    const transaction = createTransaction({ amount: -75, description: 'Lunch' })
    render(
      <TransactionForm categories={categories} initial={transaction} onSubmit={vi.fn()} />,
    )
    expect(screen.getByLabelText('Bedrag')).toHaveValue(75)
    expect(screen.getByLabelText('Omschrijving')).toHaveValue('Lunch')
  })

  it('shows validation error for invalid amount', async () => {
    const user = userEvent.setup()
    render(<TransactionForm categories={categories} onSubmit={vi.fn()} />)
    await user.click(screen.getByRole('button', { name: 'Opslaan' }))
    expect(
      screen.getByText('Bedrag is verplicht en moet groter dan 0 zijn'),
    ).toBeInTheDocument()
  })
})
