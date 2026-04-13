import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../App'

function Home() {
  const [recentCases, setRecentCases] = useState([])
  const [stats, setStats] = useState({ active: 0, found: 0, total: 0 })
  const { API_URL } = useContext(AuthContext)

  useEffect(() => {
    axios.get(`${API_URL}/cases?status=Active`)
      .then(res => {
        setRecentCases(res.data.slice(0, 6))
        setStats({
          active: res.data.length,
          found: 0,
          total: res.data.length
        })
      })
      .catch(err => console.error(err))
  }, [API_URL])

  return (
    <>
      <section className="hero">
        <div className="container">
<h1>SafeFind - Protecting Lives, Reuniting Families</h1>
          <p>Help us bring missing persons home. Upload sightings, report cases, and use AI-powered face recognition to find matches.</p>
          <div className="hero-actions">
            <Link to="/report-missing" className="btn btn-primary">Report Missing Person</Link>
            <Link to="/upload-found" className="btn btn-outline">Upload Found Person</Link>
            <Link to="/cases" className="btn btn-outline">View All Cases</Link>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="container">
          <div className="stat-item">
            <h3>{stats.active}</h3>
            <p>Active Cases</p>
          </div>
          <div className="stat-item">
            <h3>{stats.found}</h3>
            <p>Found Safe</p>
          </div>
          <div className="stat-item">
            <h3>{stats.total}</h3>
            <p>Total Reports</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Recent Missing Persons</h2>
            <p>Help identify these individuals</p>
          </div>
          
          {recentCases.length > 0 ? (
            <div className="cases-grid">
              {recentCases.map(caseItem => (
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
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ color: '#6C757D' }}>No active cases at the moment</p>
            </div>
          )}

          {recentCases.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <Link to="/cases" className="btn btn-secondary">View All Cases</Link>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-title">
            <h2>How It Works</h2>
            <p>Three simple steps to help find missing persons</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', marginTop: '40px' }}>
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📋</div>
              <h3>1. Report</h3>
              <p style={{ color: '#6C757D' }}>Families can report missing persons with photos and details</p>
            </div>
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔍</div>
              <h3>2. Match</h3>
              <p style={{ color: '#6C757D' }}>Our AI compares uploaded images against the database</p>
            </div>
            <div style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏠</div>
              <h3>3. Reunite</h3>
              <p style={{ color: '#6C757D' }}>When a match is found, families are notified</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home