import type { CategoryWithBudget } from '../types'
import { BudgetBar } from './BudgetBar'
import { Button } from './Button'

interface CategoryCardProps {
  category: CategoryWithBudget
  onEdit?: () => void
  onDelete?: () => void
  readOnly?: boolean
}

export function CategoryCard({ category, onEdit, onDelete, readOnly = false }: CategoryCardProps) {
  return (
    <article className="category-card">
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
