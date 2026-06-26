import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CategoryCard } from './CategoryCard'
import { createCategoryWithBudget } from '../test/helpers'

describe('CategoryCard', () => {
  const category = createCategoryWithBudget()

  it('renders budget bar and action buttons', () => {
    render(<CategoryCard category={category} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Boodschappen')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bewerken' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Verwijderen' })).toBeInTheDocument()
  })

  it('calls edit and delete handlers', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(<CategoryCard category={category} onEdit={onEdit} onDelete={onDelete} />)
    await user.click(screen.getByRole('button', { name: 'Bewerken' }))
    await user.click(screen.getByRole('button', { name: 'Verwijderen' }))
    expect(onEdit).toHaveBeenCalledOnce()
    expect(onDelete).toHaveBeenCalledOnce()
  })
})
