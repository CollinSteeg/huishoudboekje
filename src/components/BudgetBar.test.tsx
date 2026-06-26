import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { BudgetBar } from './BudgetBar'
import { createCategoryWithBudget } from '../test/helpers'

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

  it('shows over budget warning', () => {
    const category = createCategoryWithBudget({
      budgetStatus: 'over',
      spent: 600,
      remaining: -100,
      maxBudget: 500,
    })
    render(<BudgetBar category={category} />)
    expect(screen.getByText('Over budget!')).toBeInTheDocument()
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
