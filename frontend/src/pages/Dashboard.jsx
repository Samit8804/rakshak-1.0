import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../App.jsx'
import axios from 'axios'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout, API_URL } = useContext(AuthContext)
  const [form, setForm] = useState({ name: '', age: '', location: '', description: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [myReports, setMyReports] = useState([])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const res = await axios.post(`${API_URL}/report`, form)
      setMessage('Missing person report submitted successfully!')
      setForm({ name: '', age: '', location: '', description: '' })
      fetchMyReports()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  const fetchMyReports = async () => {
    try {
      const res = await axios.get(`${API_URL}/report/mine`)
      setMyReports(res.data)
    } catch (err) {
      console.error('Failed to fetch reports')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    fetchMyReports()
  }, [])

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="container">
          <h1>Welcome to SafeFind, {user?.name || user?.username}</h1>
          <button onClick={handleLogout} className="btn btn-outline btn-small">Logout</button>
        </div>
      </header>

      <section className="dashboard-stats container">
        <div className="card">
          <h3>Submit Missing Report</h3>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Age</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Location Last Seen</label>
              <input name="location" type="text" value={form.location} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-error">{error}</div>}
          </form>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <button className="btn btn-secondary w-full">Upload Found Person</button>
            <button className="btn btn-secondary w-full">View Map</button>
            <button className="btn btn-secondary w-full">Recent Cases</button>
          </div>
        </div>

        {myReports.length > 0 && (
          <div className="card">
            <h3>My Reports ({myReports.length})</h3>
            <div style={{ display: 'grid', gap: '1rem', maxHeight: '400px', overflow: 'auto' }}>
              {myReports.map(report => (
                <div key={report._id} className="report-item">
                  <h4>{report.name}</h4>
                  <p><strong>Location:</strong> {report.location}</p>
                  <p>{report.description}</p>
                  <small>{new Date(report.createdAt).toLocaleDateString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

