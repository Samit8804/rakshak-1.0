import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        navigate('/dashboard')
      } else {
        setError((data.errors && data.errors[0].msg) || data.msg || 'Signup failed')
      }
    } catch (err) {
      setError('Server error')
    }
  }

  return (
    <div className="page signup-page">
      <div className="card">
        <h2>SafeFind</h2>
        <form onSubmit={onSubmit}>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}
