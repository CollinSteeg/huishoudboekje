import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TransactionList } from './TransactionList'
import { createCategory, createTransaction } from '../test/helpers'

describe('TransactionList', () => {
  const categories = [createCategory({ id: 'cat-1', name: 'Boodschappen' })]

  it('shows empty state when no transactions', () => {
    render(
      <TransactionList
        transactions={[]}
        categories={categories}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Nog geen transacties deze maand.')).toBeInTheDocument()
  })

  it('renders transactions with category and amount', () => {
    const transactions = [
      createTransaction({ description: 'Supermarkt', amount: -42.5, categoryId: 'cat-1' }),
      createTransaction({
        id: 'tx-2',
        description: 'Salaris',
        amount: 2000,
        categoryId: null,
      }),
    ]
    render(
      <TransactionList
        transactions={transactions}
        categories={categories}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )
    expect(screen.getByText('Supermarkt')).toBeInTheDocument()
    expect(screen.getByText('Boodschappen')).toBeInTheDocument()
    expect(screen.getByText('Salaris')).toBeInTheDocument()
  })

  it('calls edit and delete handlers', async () => {
    const user = userEvent.setup()
    const transaction = createTransaction()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(
      <TransactionList
        transactions={[transaction]}
        categories={categories}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Bewerken' }))
    await user.click(screen.getByRole('button', { name: 'Verwijderen' }))
    expect(onEdit).toHaveBeenCalledWith(transaction)
    expect(onDelete).toHaveBeenCalledWith(transaction)
  })

  it('calls onCategoryChange when dropping on a category', () => {
    const transaction = createTransaction({ id: 'tx-1', description: 'Supermarkt', categoryId: null })
    const onCategoryChange = vi.fn()
    render(
      <TransactionList
        transactions={[transaction]}
        categories={categories}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onCategoryChange={onCategoryChange}
      />,
    )

    const handle = screen.getByLabelText('Slepen naar categorie')
    const dropZone = screen.getByText('Boodschappen', { selector: '.category-drop-zone' })

    fireEvent.dragStart(handle, {
      dataTransfer: { setData: vi.fn(), effectAllowed: 'move' },
    })
    fireEvent.drop(dropZone, {
      dataTransfer: { getData: () => 'tx-1' },
    })

    expect(onCategoryChange).toHaveBeenCalledWith('tx-1', 'cat-1')
  })
})
