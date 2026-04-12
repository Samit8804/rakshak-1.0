import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Search, UserPlus, MapPin } from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

function Cases() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${API_URL}/cases`)
      setCases(res.data)
    } catch (err) {
      console.log('Using mock data')
      setCases([
        { _id: '1', fullName: 'Sarah Johnson', age: 24, gender: 'Female', lastSeenLocation: { address: 'Mumbai, Maharashtra' }, dateMissing: '2024-01-15', status: 'Active', images: [] },
        { _id: '2', fullName: 'Priya Sharma', age: 19, gender: 'Female', lastSeenLocation: { address: 'Delhi, NCR' }, dateMissing: '2024-01-20', status: 'Active', images: [] },
        { _id: '3', fullName: 'Anita Verma', age: 32, gender: 'Female', lastSeenLocation: { address: 'Bangalore, Karnataka' }, dateMissing: '2024-01-10', status: 'Found', images: [] },
        { _id: '4', fullName: 'Meera Patel', age: 27, gender: 'Female', lastSeenLocation: { address: 'Ahmedabad, Gujarat' }, dateMissing: '2024-01-22', status: 'Active', images: [] },
        { _id: '5', fullName: 'Riya Gupta', age: 21, gender: 'Female', lastSeenLocation: { address: 'Chennai, Tamil Nadu' }, dateMissing: '2024-01-18', status: 'Active', images: [] },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          caseItem.lastSeenLocation?.address?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGender = !genderFilter || caseItem.gender === genderFilter
    const matchesStatus = !statusFilter || caseItem.status?.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesGender && matchesStatus
  })

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <h1 className="page-title">All Cases</h1>
          <p className="page-subtitle">Search and filter through all reported cases</p>
        </div>

        <div className="cases-page-filters">
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '48px', width: '100%' }}
            />
          </div>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Found">Found</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="cases-grid">
              {filteredCases.map((caseItem) => (
                <Link to={`/cases/${caseItem._id}`} key={caseItem._id} className="case-card">
                  <div className="case-image">
                    <div className="case-avatar">
                      <UserPlus size={32} />
                    </div>
                  </div>
                  <div className="case-content">
                    <h4>{caseItem.fullName}</h4>
                    <p className="case-meta">Age: {caseItem.age} • {caseItem.gender}</p>
                    <p className="case-location">📍 {caseItem.lastSeenLocation?.address || 'Location not specified'}</p>
                    <span className={`case-status ${caseItem.status?.toLowerCase()}`}>
                      {caseItem.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {filteredCases.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <Search size={40} />
                </div>
                <h3>No cases found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Cases