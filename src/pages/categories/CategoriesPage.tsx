import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '../../components/shared/Button'
import { CategoryCard } from '../../components/categories/CategoryCard'
import { CategoryForm } from '../../components/categories/CategoryForm'
import { ConfirmDialog } from '../../components/shared/ConfirmDialog'
import { Modal } from '../../components/shared/Modal'
import { useAuth } from '../../hooks/useAuth'
import { useCategories } from '../../hooks/useCategories'
import { useHouseholdBook } from '../../hooks/useHouseholdBook'
import type { CategoryWithBudget } from '../../types'
import { getBookAccess } from '../../utils/bookAccess'
import { isCategoryExpired } from '../../utils/categoryHelpers'
import { categoryService } from '../../services/categoryService'

export function CategoriesPage() {
  const { bookId } = useParams<{ bookId: string }>()
  const { user } = useAuth()
  const { book, loading: bookLoading } = useHouseholdBook(bookId)
  const { categories, loading } = useCategories(bookId)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryWithBudget | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryWithBudget | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const access = useMemo(
    () => (book && user ? getBookAccess(book, user) : null),
    [book, user],
  )

  const sortedCategories = useMemo(
    () =>
      [...categories].sort(
        (a, b) => Number(isCategoryExpired(a.endDate)) - Number(isCategoryExpired(b.endDate)),
      ),
    [categories],
  )

  if (bookLoading) {
    return <p>Laden...</p>
  }

  if (!book || book.archived) {
    return <Navigate to="/" replace />
  }

  if (!access?.canRead) {
    return <p className="error">Je hebt geen toegang tot dit boekje.</p>
  }

  async function handleCreate(data: Parameters<typeof categoryService.create>[1]) {
    if (!bookId) return
    await categoryService.create(bookId, data)
    setShowForm(false)
  }

  async function handleUpdate(data: Parameters<typeof categoryService.create>[1]) {
    if (!bookId || !editingCategory) return
    await categoryService.update(bookId, editingCategory.id, data)
    setEditingCategory(null)
  }

  async function handleDelete() {
    if (!bookId || !deletingCategory) return
    setActionLoading(true)
    try {
      await categoryService.delete(bookId, deletingCategory.id)
      setDeletingCategory(null)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <section className="page">
      <div className="page__header">
        <div>
          <p className="breadcrumb">
            <Link to={`/books/${bookId}`}>{book.name}</Link> / Categorieën
          </p>
          <h1>Categorieën</h1>
          <p>Bekijk hoeveel budget er nog beschikbaar is per categorie.</p>
          {!access.canWrite && (
            <p className="book-detail__readonly-hint">Je hebt alleen-lezen toegang tot dit boekje.</p>
          )}
        </div>
        {access.canWrite && (
          <Button onClick={() => setShowForm(true)}>Nieuwe categorie</Button>
        )}
      </div>

      {loading ? (
        <p>Laden...</p>
      ) : categories.length === 0 ? (
        <p className="empty-state">Nog geen categorieën. Voeg er een toe!</p>
      ) : (
        <div className="category-list">
          {sortedCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={access.canWrite ? () => setEditingCategory(category) : undefined}
              onDelete={access.canWrite ? () => setDeletingCategory(category) : undefined}
              readOnly={!access.canWrite}
            />
          ))}
        </div>
      )}

      {access.canWrite && (
        <>
          <Modal title="Nieuwe categorie" open={showForm} onClose={() => setShowForm(false)}>
            <CategoryForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          </Modal>

          <Modal
            title="Categorie bewerken"
            open={!!editingCategory}
            onClose={() => setEditingCategory(null)}
          >
            {editingCategory && (
              <CategoryForm
                initial={editingCategory}
                onSubmit={handleUpdate}
                onCancel={() => setEditingCategory(null)}
              />
            )}
          </Modal>

          <ConfirmDialog
            open={!!deletingCategory}
            title="Categorie verwijderen"
            message={`Weet je zeker dat je "${deletingCategory?.name}" wilt verwijderen?`}
            confirmLabel="Verwijderen"
            onConfirm={handleDelete}
            onCancel={() => setDeletingCategory(null)}
            loading={actionLoading}
          />
        </>
      )}
    </section>
  )
}
