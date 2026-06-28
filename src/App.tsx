import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/shared/Layout'
import { ProtectedRoute } from './components/shared/ProtectedRoute'
import { ArchivedBooksPage } from './pages/books/ArchivedBooksPage'
import { BookDetailPage } from './pages/books/BookDetailPage'
import { BooksPage } from './pages/books/BooksPage'
import { CategoriesPage } from './pages/categories/CategoriesPage'
import { LoginPage } from './pages/auth/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<BooksPage />} />
            <Route path="/archived" element={<ArchivedBooksPage />} />
            <Route path="/books/:bookId" element={<BookDetailPage />} />
            <Route path="/books/:bookId/categories" element={<CategoriesPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
