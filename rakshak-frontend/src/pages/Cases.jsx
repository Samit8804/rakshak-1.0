import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../App'

function Cases() {
  const [cases, setCases] = useState([])
  const [filters, setFilters] = useState({ status: '', gender: '', minAge: '', maxAge: '', location: '' })
  const [loading, setLoading] = useState(true)
  const { API_URL } = useContext(AuthContext)

  useEffect(() => {
    fetchCases()
  }, [filters])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.status) params.append('status', filters.status)
      if (filters.gender) params.append('gender', filters.gender)
      if (filters.minAge) params.append('minAge', filters.minAge)
      if (filters.maxAge) params.append('maxAge', filters.maxAge)
      if (filters.location) params.append('location', filters.location)

      const res = await axios.get(`${API_URL}/cases?${params.toString()}`)
      setCases(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <h2>All Missing Persons Cases</h2>
          <p>Browse and search through all reported cases</p>
        </div>

        <div className="filters">
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Found">Found</option>
            <option value="Closed">Closed</option>
          </select>

          <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <input 
            type="number" 
            placeholder="Min Age" 
            value={filters.minAge}
            onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
          />

          <input 
            type="number" 
            placeholder="Max Age" 
            value={filters.maxAge}
            onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
          />

          <input 
            type="text" 
            placeholder="Location Search" 
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : cases.length > 0 ? (
          <div className="cases-grid">
            {cases.map(caseItem => (
              <Link to={`/cases/${caseItem._id}`} key={caseItem._id} className="card case-card">
                <div className="case-card-image">
                  {caseItem.images?.[0] ? (
                    <img src={`http://localhost:5000${caseItem.images[0]}`} alt={caseItem.fullName} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#999' }}>No Image</span>
                    </div>
                  )}
                  <span className={`case-status ${caseItem.status?.toLowerCase()}`}>
                    {caseItem.status}
                  </span>
                </div>
                <div className="case-card-content">
                  <h3>{caseItem.fullName}</h3>
                  <div className="meta">
                    <span>{caseItem.age} years</span>
                    <span>{caseItem.gender}</span>
                  </div>
                  <div className="location">
                    📍 {caseItem.lastSeenLocation?.address || 'Location not specified'}
                  </div>
                  <p className="description">{caseItem.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#6C757D', fontSize: '1.1rem' }}>No cases found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cases