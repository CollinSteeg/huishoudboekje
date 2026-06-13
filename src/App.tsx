import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ArchivedBooksPage } from './pages/ArchivedBooksPage'
import { BookDetailPage } from './pages/BookDetailPage'
import { BooksPage } from './pages/BooksPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { LoginPage } from './pages/LoginPage'

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
