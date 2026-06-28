import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BudgetBar } from '../BudgetBar'
import { createCategoryWithBudget } from '../../../test/helpers'

describe('BudgetBar', () => {
  it('shows remaining budget and spent amount', () => {
    const category = createCategoryWithBudget({
      name: 'Boodschappen',
      maxBudget: 500,
      spent: 100,
      remaining: 400,
      budgetStatus: 'ok',
    })
    render(<BudgetBar category={category} />)
    expect(screen.getByText('Boodschappen')).toBeInTheDocument()
    expect(screen.getByText(/Uitgegeven:/)).toBeInTheDocument()
  })

  it('shows over budget amount instead of negative remaining', () => {
    const category = createCategoryWithBudget({
      budgetStatus: 'over',
      spent: 600,
      remaining: -100,
      maxBudget: 500,
    })
    render(<BudgetBar category={category} />)
    expect(screen.getByText('€ 100,00 over budget')).toBeInTheDocument()
  })

  it('shows depleted when budget is fully used', () => {
    const category = createCategoryWithBudget({
      budgetStatus: 'depleted',
      spent: 200,
      remaining: 0,
      maxBudget: 200,
    })
    render(<BudgetBar category={category} />)
    expect(screen.getByText('Budget op')).toBeInTheDocument()
    expect(screen.queryByText('Bijna op')).not.toBeInTheDocument()
  })

  it('shows warning when budget is almost depleted', () => {
    const category = createCategoryWithBudget({
      budgetStatus: 'warning',
      spent: 450,
      remaining: 50,
      maxBudget: 500,
    })
    render(<BudgetBar category={category} />)
    expect(screen.getByText('Bijna op')).toBeInTheDocument()
  })
})
