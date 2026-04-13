import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminProtectedRoute({ children }) {
  const navigate = useNavigate()
  const [allowed, setAllowed] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      setAllowed(false)
      return
    }
    fetch('/api/report/all', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then((res) => {
      if (res.ok) {
        setAllowed(true)
      } else {
        navigate('/dashboard', { replace: true })
        setAllowed(false)
      }
    }).catch(() => {
      navigate('/dashboard', { replace: true })
      setAllowed(false)
    })
  }, [navigate])

  if (allowed === null) return <div className="card">Verifying admin access...</div>
  return <>{children}</>
}
