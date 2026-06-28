import type { CategoryWithBudget } from '../../types'
import { isCategoryExpired } from '../../utils/categoryHelpers'
import { BudgetBar } from '../categories/BudgetBar'
import { Button } from '../shared/Button'

interface CategoryCardProps {
  category: CategoryWithBudget
  onEdit?: () => void
  onDelete?: () => void
  readOnly?: boolean
}

export function CategoryCard({ category, onEdit, onDelete, readOnly = false }: CategoryCardProps) {
  const expired = isCategoryExpired(category.endDate)

  return (
    <article className={`category-card${expired ? ' category-card--expired' : ''}`}>
      <BudgetBar category={category} />
      {!readOnly && onEdit && onDelete && (
        <div className="category-card__actions">
          <Button variant="secondary" onClick={onEdit}>
            Bewerken
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Verwijderen
          </Button>
        </div>
      )}
    </article>
  )
}
