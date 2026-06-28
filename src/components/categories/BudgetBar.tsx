import { formatCurrency } from '../../utils/formatCurrency'
import { isCategoryExpired } from '../../utils/categoryHelpers'
import type { CategoryWithBudget } from '../../types'

const dateFormat: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}

interface BudgetBarProps {
  category: CategoryWithBudget
}

function formatBudgetSummary(category: CategoryWithBudget): string {
  if (category.budgetStatus === 'over') {
    return `${formatCurrency(category.spent - category.maxBudget)} over budget`
  }
  if (category.budgetStatus === 'depleted') {
    return 'Budget op'
  }
  return `${formatCurrency(category.remaining)} over van ${formatCurrency(category.maxBudget)}`
}

export function BudgetBar({ category }: BudgetBarProps) {
  const expired = isCategoryExpired(category.endDate)
  const spentPercent =
    category.maxBudget > 0
      ? Math.min((category.spent / category.maxBudget) * 100, 100)
      : category.spent > 0
        ? 100
        : 0

  return (
    <div className="budget-bar">
      <div className="budget-bar__header">
        <span>{category.name}</span>
        <span>{formatBudgetSummary(category)}</span>
      </div>
      <div className="budget-bar__track">
        <div
          className={`budget-bar__fill budget-bar__fill--${category.budgetStatus}`}
          style={{ width: `${spentPercent}%` }}
        />
      </div>
      <div className="budget-bar__footer">
        <span>Uitgegeven: {formatCurrency(category.spent)}</span>
        {category.endDate && (
          <span className={expired ? 'budget-bar__expired' : undefined}>
            {expired ? 'Verlopen' : 'Geldig tot'}{' '}
            {category.endDate.toLocaleDateString('nl-NL', dateFormat)}
          </span>
        )}
        {category.budgetStatus === 'warning' && (
          <span className="budget-bar__warning">Bijna op</span>
        )}
      </div>
    </div>
  )
}
