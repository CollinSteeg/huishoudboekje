import { Link, Outlet } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../shared/Button'

export function Layout() {
  const { user } = useAuth()

  return (
    <div className="layout">
      <header className="layout__header">
        <Link to="/" className="layout__brand">
          Huishoudboekje
        </Link>
        <nav className="layout__nav">
          <Link to="/">Boekjes</Link>
          <Link to="/archived">Gearchiveerd</Link>
        </nav>
        <div className="layout__user">
          <span>{user?.email}</span>
          <Button variant="ghost" onClick={() => authService.signOut()}>
            Uitloggen
          </Button>
        </div>
      </header>
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  )
}
