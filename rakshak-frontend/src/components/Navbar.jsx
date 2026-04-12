import { Link, useLocation } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../App'

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18l7 3.89v5.15c0 4.38-3.05 8.47-7 9.63-3.95-1.16-7-5.25-7-9.63V8.07l7-3.89z"/>
            <path d="M12 6L6 9.5v4c0 3.5 2.4 6.78 6 7.9 3.6-1.12 6-4.4 6-7.9v-4L12 6z"/>
          </svg>
          Rakshak
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={isActive('/')}>Home</Link>
          <Link to="/cases" className={isActive('/cases')}>Cases</Link>
          <Link to="/map" className={isActive('/map')}>Map</Link>
          <Link to="/upload-found" className={isActive('/upload-found')}>Found Person</Link>
        </div>

        <div className="nav-auth">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="btn btn-small btn-secondary">Admin</Link>
              )}
              <span style={{ marginRight: '12px', fontWeight: 500 }}>{user.username}</span>
              <button onClick={logout} className="btn btn-small btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-small btn-outline">Login</Link>
              <Link to="/register" className="btn btn-small btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar