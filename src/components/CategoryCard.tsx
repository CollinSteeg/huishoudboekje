import type { CategoryWithBudget } from '../types'
import { BudgetBar } from './BudgetBar'
import { Button } from './Button'

interface CategoryCardProps {
  category: CategoryWithBudget
  onEdit: () => void
  onDelete: () => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <article className="category-card">
      <BudgetBar category={category} />
      <div className="category-card__actions">
        <Button variant="secondary" onClick={onEdit}>
          Bewerken
        </Button>
        <Button variant="danger" onClick={onDelete}>
          Verwijderen
        </Button>
      </div>
    </article>
  )
}
