import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MonthPicker } from './MonthPicker'

describe('MonthPicker', () => {
  it('displays current month label', () => {
    render(<MonthPicker filter={{ month: 5, year: 2025 }} onChange={vi.fn()} />)
    expect(screen.getByText(/juni.*2025/i)).toBeInTheDocument()
  })

  it('changes month when navigation buttons are clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MonthPicker filter={{ month: 5, year: 2025 }} onChange={onChange} />)

    await user.click(screen.getByRole('button', { name: 'Vorige maand' }))
    expect(onChange).toHaveBeenCalledWith({ month: 4, year: 2025 })

    await user.click(screen.getByRole('button', { name: 'Volgende maand' }))
    expect(onChange).toHaveBeenCalledWith({ month: 6, year: 2025 })
  })
})
