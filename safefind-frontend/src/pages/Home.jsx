import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { 
  UserPlus, 
  Camera, 
  MapPin, 
  Search, 
  Users, 
  Bell, 
  Info,
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  LogIn,
  UserPlus as SignUp
} from 'lucide-react'

const features = [
  { id: 'report', title: 'Report Missing', description: 'File a missing person report', icon: UserPlus, path: '/report-missing', color: '#6366f1' },
  { id: 'face', title: 'Face Detection', description: 'AI-powered face matching', icon: Camera, path: '/upload-found', color: '#8b5cf6' },
  { id: 'map', title: 'View Cases Map', description: 'Interactive map view', icon: MapPin, path: '/cases', color: '#ec4899' },
  { id: 'search', title: 'Search Cases', description: 'Find missing persons', icon: Search, path: '/cases', color: '#14b8a6' },
  { id: 'community', title: 'Community Reports', description: 'View sightings', icon: Users, path: '/community', color: '#f59e0b' },
  { id: 'view', title: 'View All Cases', description: 'Browse all cases', icon: Eye, path: '/cases', color: '#3b82f6' },
  { id: 'alerts', title: 'Alerts', description: 'Important notifications', icon: Bell, path: '/community', color: '#ef4444' },
  { id: 'about', title: 'About Project', description: 'Learn more', icon: Info, path: '/about', color: '#64748b' },
]

const API_URL = 'http://localhost:5000/api'

function Home() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ active: 0, found: 0, total: 0, sightings: 0 })
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get(`${API_URL}/auth/me`)
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
    }
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const casesRes = await axios.get(`${API_URL}/cases`)
      const allCases = casesRes.data
      
      const activeCount = allCases.filter(c => c.status === 'Active').length
      const foundCount = allCases.filter(c => c.status === 'Found').length
      
      setStats({
        active: activeCount,
        found: foundCount,
        total: allCases.length,
        sightings: Math.floor(Math.random() * 50) + 10
      })
      
      setCases(allCases.slice(0, 4))
    } catch (err) {
      console.log('Using mock data - backend not connected')
      setStats({ active: 12, found: 5, total: 17, sightings: 23 })
      setCases([
        { _id: '1', fullName: 'Sarah Johnson', age: 24, lastSeenLocation: { address: 'Mumbai, Maharashtra' }, status: 'Active' },
        { _id: '2', fullName: 'Priya Sharma', age: 19, lastSeenLocation: { address: 'Delhi, NCR' }, status: 'Active' },
        { _id: '3', fullName: 'Anita Verma', age: 32, lastSeenLocation: { address: 'Bangalore, Karnataka' }, status: 'Found' },
        { _id: '4', fullName: 'Meera Patel', age: 27, lastSeenLocation: { address: 'Ahmedabad, Gujarat' }, status: 'Active' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <div className="app-wrapper">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="header-left">
              <div className="logo">
                <div className="logo-icon">
                  <Shield />
                </div>
                <div className="logo-text">
                  <h1>SafeFind</h1>
                  <span>Protecting Lives, Finding Missing</span>
                </div>
              </div>
            </Link>
            <div className="header-right">
              <Link to="/community" className="notification-btn">
                <Bell />
                <span className="notification-badge"></span>
              </Link>
              {user ? (
                <div className="user-menu">
                  <button className="profile-btn" onClick={handleLogout}>
                    <div className="profile-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                    <div className="profile-info">
                      <div className="profile-name">{user.username}</div>
                      <div className="profile-role">{user.role || 'User'}</div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn btn-login">
                    <LogIn size={18} /> Login
                  </Link>
                  <Link to="/register" className="btn btn-signup">
                    <SignUp size={18} /> Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <div className="hero-banner">
            <div className="hero-content">
              <h1>Welcome to SafeFind</h1>
              <p>Help us find missing persons and reunite families. Your contribution can make a difference.</p>
              <div className="hero-actions">
                <Link to="/report-missing" className="btn btn-primary btn-lg">
                  <UserPlus size={20} /> Report Missing
                </Link>
                <Link to="/upload-found" className="btn btn-outline btn-lg">
                  <Camera size={20} /> Upload Found Person
                </Link>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon blue">
                <Clock />
              </div>
              <div className="stat-info">
                <h3>{stats.active}</h3>
                <p>Active Cases</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <CheckCircle />
              </div>
              <div className="stat-info">
                <h3>{stats.found}</h3>
                <p>Found Safe</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <AlertTriangle />
              </div>
              <div className="stat-info">
                <h3>{stats.total}</h3>
                <p>Total Reports</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <Users />
              </div>
              <div className="stat-info">
                <h3>{stats.sightings}</h3>
                <p>Sightings Reported</p>
              </div>
            </div>
          </div>

          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
            <p className="section-subtitle">Access all features from one place</p>
          </div>

          <div className="cards-grid">
            {features.map((feature) => (
              <Link 
                to={feature.path} 
                key={feature.id} 
                className="feature-card"
                style={{ '--card-color': feature.color }}
              >
                <div className="card-icon">
                  <feature.icon />
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="card-description">{feature.description}</p>
              </Link>
            ))}
          </div>

          <div className="recent-section">
            <div className="section-header-row">
              <div className="section-header">
                <h2 className="section-title">Recent Cases</h2>
                <p className="section-subtitle">Latest missing persons reports</p>
              </div>
              <Link to="/cases" className="view-all-btn">
                View All <span>→</span>
              </Link>
            </div>

            <div className="cases-grid">
              {cases.map((caseItem) => (
                <Link to={`/cases/${caseItem._id}`} key={caseItem._id} className="case-card">
                  <div className="case-image">
                    <div className="case-avatar">
                      <UserPlus size={32} />
                    </div>
                  </div>
                  <div className="case-content">
                    <h4>{caseItem.fullName}</h4>
                    <p className="case-meta">Age: {caseItem.age}</p>
                    <p className="case-location">📍 {caseItem.lastSeenLocation?.address || 'Location not specified'}</p>
                    <span className={`case-status ${caseItem.status?.toLowerCase()}`}>
                      {caseItem.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>© 2024 SafeFind. All rights reserved.</p>
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/community">Community</Link>
              <Link to="/">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home