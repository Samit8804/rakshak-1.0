import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', age: '', location: '', description: '' })
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [reports, setReports] = useState([])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const onSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('Report submitted')
        setForm({ name: '', age: '', location: '', description: '' })
        // Refresh the list after submission
        fetchMine()
      } else {
        setError((data.errors && data.errors[0].msg) || data.msg || 'Submission failed')
      }
    } catch (err) {
      setError('Server error')
    }
  }

  const onLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const fetchMine = async () => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/report/mine', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setReports(data)
      } else if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
      }
    } catch (e) {
      // ignore fetch errors in listing for now
    }
  }

  useEffect(() => {
    fetchMine()
  }, [])

  return (
    <div className="page dashboard-page">
      <header className="header">
        <h1>SafeFind Dashboard</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      <section className="grid">
        <div className="card">
          <h3>Submit Missing Report</h3>
          <form onSubmit={onSubmit}>
            <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
            <input name="age" placeholder="Age" value={form.age} onChange={onChange} />
            <input name="location" placeholder="Location" value={form.location} onChange={onChange} required />
            <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} required />
            <button type="submit">Submit</button>
          </form>
          {message && <div className="success">{message}</div>}
          {error && <div className="error">{error}</div>}
        </div>
        <div className="card">
          <h3>Found Items</h3>
          <p>Protected section for future features.</p>
        </div>
        {reports.length > 0 && (
          <div className="card" aria-label="my-reports">
            <h3>My Reports</h3>
            {reports.map((r) => (
              <div key={r._id} className="report-card">
                <strong>{r.name}</strong> — {r.location} • {new Date(r.createdAt).toLocaleDateString()}
                <p>{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
