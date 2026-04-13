import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App'

function AdminDashboard() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ active: 0, found: 0, closed: 0, total: 0 })
  const { API_URL } = useContext(AuthContext)

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${API_URL}/cases`)
      setCases(res.data)
      
      const active = res.data.filter(c => c.status === 'Active').length
      const found = res.data.filter(c => c.status === 'Found').length
      const closed = res.data.filter(c => c.status === 'Closed').length
      
      setStats({
        active,
        found,
        closed,
        total: res.data.length
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (caseId, newStatus) => {
    try {
      await axios.put(`${API_URL}/cases/${caseId}/status`, { status: newStatus })
      fetchCases()
    } catch (err) {
      console.error(err)
    }
  }

  const deleteCase = async (caseId) => {
    if (!confirm('Are you sure you want to delete this case?')) return
    
    try {
      await axios.delete(`${API_URL}/cases/${caseId}`)
      fetchCases()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1 style={{ marginBottom: '30px', color: '#1D3557' }}>Admin Dashboard</h1>

        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <h3>{stats.active}</h3>
            <p>Active Cases</p>
          </div>
          <div className="dashboard-stat">
            <h3 style={{ color: '#2A9D8F' }}>{stats.found}</h3>
            <p>Found Safe</p>
          </div>
          <div className="dashboard-stat">
            <h3 style={{ color: '#6C757D' }}>{stats.closed}</h3>
            <p>Closed Cases</p>
          </div>
          <div className="dashboard-stat">
            <h3>{stats.total}</h3>
            <p>Total Cases</p>
          </div>
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Reported</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cases.map(caseItem => (
                <tr key={caseItem._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {caseItem.images?.[0] && (
                        <img 
                          src={`http://localhost:5000${caseItem.images[0]}`} 
                          alt={caseItem.fullName}
                          style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <Link to={`/cases/${caseItem._id}`} style={{ fontWeight: 600, color: '#1D3557' }}>
                          {caseItem.fullName}
                        </Link>
                        <div style={{ fontSize: '0.85rem', color: '#6C757D' }}>
                          {caseItem.lastSeenLocation?.address || 'No location'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{caseItem.age}</td>
                  <td>{caseItem.gender}</td>
                  <td>
                    <span className={`case-status ${caseItem.status?.toLowerCase()}`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td>{formatDate(caseItem.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {caseItem.status === 'Active' && (
                        <button 
                          onClick={() => updateStatus(caseItem._id, 'Found')}
                          className="btn btn-small btn-success"
                        >
                          Mark Found
                        </button>
                      )}
                      {caseItem.status !== 'Closed' && (
                        <button 
                          onClick={() => updateStatus(caseItem._id, 'Closed')}
                          className="btn btn-small btn-outline"
                        >
                          Close
                        </button>
                      )}
                      <button 
                        onClick={() => deleteCase(caseItem._id)}
                        className="btn btn-small"
                        style={{ background: '#E63946', color: 'white' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cases.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: '#6C757D', fontSize: '1.1rem' }}>No cases found</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard