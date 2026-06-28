import type { MonthFilter } from '../../types'
import { formatMonthYear } from '../../utils/dateHelpers'
import { Button } from '../shared/Button'

interface MonthPickerProps {
  filter: MonthFilter
  onChange: (filter: MonthFilter) => void
}

export function MonthPicker({ filter, onChange }: MonthPickerProps) {
  function changeMonth(delta: number) {
    const date = new Date(filter.year, filter.month + delta, 1)
    onChange({ month: date.getMonth(), year: date.getFullYear() })
  }

  return (
    <div className="month-picker">
      <Button variant="secondary" onClick={() => changeMonth(-1)} aria-label="Vorige maand">
        ←
      </Button>
      <span className="month-picker__label">{formatMonthYear(filter)}</span>
      <Button variant="secondary" onClick={() => changeMonth(1)} aria-label="Volgende maand">
        →
      </Button>
    </div>
  )
}
