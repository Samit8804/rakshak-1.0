import React, { useEffect, useState } from 'react'

export default function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = async () => {
    try {
      const res = await fetch('/api/report/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) {
        const data = await res.json()
        setReports(data)
      } else {
        setError('Access denied')
      }
    } catch (e) {
      setError('Server error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const deleteReport = async (id) => {
    try {
      const res = await fetch(`/api/report/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      if (res.ok) {
        fetchAll()
      } else {
        setError('Failed to delete')
      }
    } catch (e) {
      setError('Server error')
    }
  }

  const toggleArchive = async (id, archived) => {
    try {
      const res = await fetch(`/api/report/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ archived })
      })
      if (res.ok) {
        fetchAll()
      } else {
        setError('Failed to update')
      }
    } catch (e) {
      setError('Server error')
    }
  }

  if (loading) return <div className="card">Loading admin reports...</div>
  if (error) return <div className="card">{error}</div>

  return (
    <div className="page admin-page">
      <div className="card">
        <h2>All Reports (Admin)</h2>
        {reports.length === 0 && <p>No reports found.</p>}
        {reports.map((r) => (
          <div key={r._id} className="report-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong>{r.name}</strong> by {r.user?.name || r.user?.email} — {r.location} on {new Date(r.createdAt).toLocaleDateString()}
            </div>
            <p>{r.description}</p>
            <div className="admin-actions" style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => toggleArchive(r._id, !r.archived)}>
                {r.archived ? 'Unarchive' : 'Archive'}
              </button>
              <button onClick={() => deleteReport(r._id)} style={{ background: '#e11d48' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
