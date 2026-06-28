import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { CategoriesPage } from '../CategoriesPage'
import { createCategoryWithBudget, createHouseholdBook } from '../../test/helpers'

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'user-1' }, loading: false }),
}))

vi.mock('../../hooks/useHouseholdBook', () => ({
  useHouseholdBook: () => ({
    book: createHouseholdBook(),
    loading: false,
    error: null,
  }),
}))

vi.mock('../../hooks/useCategories', () => ({
  useCategories: () => ({
    categories: [createCategoryWithBudget()],
    loading: false,
    error: null,
  }),
}))

vi.mock('../../services/categoryService', () => ({
  categoryService: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/books/book-1/categories']}>
      <Routes>
        <Route path="/books/:bookId/categories" element={<CategoriesPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('CategoriesPage', () => {
  it('renders categories with budget info', () => {
    renderPage()
    expect(screen.getByRole('heading', { name: 'Categorieën' })).toBeInTheDocument()
    expect(screen.getByText('Boodschappen')).toBeInTheDocument()
  })

  it('opens category form modal', async () => {
    const user = userEvent.setup()
    renderPage()
    await user.click(screen.getByRole('button', { name: 'Nieuwe categorie' }))
    expect(screen.getByRole('heading', { name: 'Nieuwe categorie' })).toBeInTheDocument()
  })
})
