import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatCard } from '../StatCard'

describe('StatCard', () => {
  it('renders label and formatted amount', () => {
    render(<StatCard label="Inkomsten" amount={1500} variant="income" />)
    expect(screen.getByText('Inkomsten')).toBeInTheDocument()
    expect(screen.getByText(/1\.500/)).toBeInTheDocument()
  })

  it('applies variant class', () => {
    const { container } = render(<StatCard label="Saldo" amount={0} variant="balance" />)
    expect(container.querySelector('.stat-card--balance')).toBeInTheDocument()
  })
})
