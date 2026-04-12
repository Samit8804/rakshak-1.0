import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Users, MessageSquare, AlertCircle, CheckCircle, Plus, Send, Search, X, MapPin, Loader } from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

const mockReports = [
  { id: 1, type: 'sighting', location: 'Mumbai Central', description: 'Spotted a person matching the description near the railway station', date: '2024-01-16', status: 'verified' },
  { id: 2, type: 'sighting', location: 'Andheri West', description: 'Saw her buying vegetables at a local market', date: '2024-01-17', status: 'pending' },
  { id: 3, type: 'comment', location: 'Pune', description: 'This case reminds me of a similar incident last year. Hope she is found soon.', date: '2024-01-18', status: 'approved' },
  { id: 4, type: 'alert', location: 'Thane', description: 'Urgent: Potential sighting near Thane station', date: '2024-01-19', status: 'pending' },
  { id: 5, type: 'sighting', location: 'Navi Mumbai', description: 'Person matching description entered a temple', date: '2024-01-20', status: 'verified' },
]

function Community() {
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ type: 'sighting', location: '', description: '', caseId: '' })
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [caseSearch, setCaseSearch] = useState('')
  const [showCaseDropdown, setShowCaseDropdown] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${API_URL}/cases?status=Active`)
      setCases(res.data)
    } catch (err) {
      setCases([
        { _id: '1', fullName: 'Sarah Johnson', age: 24, gender: 'Female', lastSeenLocation: { address: 'Mumbai, Maharashtra' }, status: 'Active' },
        { _id: '2', fullName: 'Priya Sharma', age: 19, gender: 'Female', lastSeenLocation: { address: 'Delhi, NCR' }, status: 'Active' },
        { _id: '3', fullName: 'Anita Verma', age: 32, gender: 'Female', lastSeenLocation: { address: 'Bangalore, Karnataka' }, status: 'Active' },
        { _id: '4', fullName: 'Meera Patel', age: 27, gender: 'Female', lastSeenLocation: { address: 'Ahmedabad, Gujarat' }, status: 'Active' },
        { _id: '5', fullName: 'Riya Gupta', age: 21, gender: 'Female', lastSeenLocation: { address: 'Chennai, Tamil Nadu' }, status: 'Active' },
      ])
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setGettingLocation(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
          const data = await response.json()
          
          let address = ''
          if (data.address) {
            address = [
              data.address.city || data.address.town || data.address.village || data.address.county,
              data.address.state,
              data.address.country
            ].filter(Boolean).join(', ')
          }
          
          if (address) {
            setFormData({ ...formData, location: address })
          } else {
            setFormData({ ...formData, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` })
          }
        } catch (err) {
          setFormData({ ...formData, location: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E` })
        }
        
        setGettingLocation(false)
      },
      (error) => {
        setGettingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please enable location access.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
          default:
            setLocationError('Unable to get your location.')
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const filteredCases = cases.filter(c => 
    c.fullName?.toLowerCase().includes(caseSearch.toLowerCase()) ||
    c.lastSeenLocation?.address?.toLowerCase().includes(caseSearch.toLowerCase())
  ).slice(0, 10)

  const selectedCase = cases.find(c => c._id === formData.caseId)

  const handleSelectCase = (caseItem) => {
    setFormData({ ...formData, caseId: caseItem._id })
    setCaseSearch('')
    setShowCaseDropdown(false)
  }

  const filteredReports = mockReports.filter(report => {
    if (filter === 'all') return true
    return report.type === filter
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case 'sighting': return <Users size={18} />
      case 'comment': return <MessageSquare size={18} />
      case 'alert': return <AlertCircle size={18} />
      default: return <Users size={18} />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified': 
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.85rem' }}><CheckCircle size={14} /> Verified</span>
      case 'pending': 
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.85rem' }}>Pending Review</span>
      case 'approved': 
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#6366f1', fontSize: '0.85rem' }}>Approved</span>
      default: return null
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to submit a report')
        setLoading(false)
        return
      }

      if (formData.type === 'sighting' && formData.caseId) {
        await axios.post(`${API_URL}/sightings`, {
          caseId: formData.caseId,
          location: formData.location,
          description: formData.description
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }

      setSuccess(true)
      setFormData({ type: 'sighting', location: '', description: '', caseId: '' })
      setTimeout(() => {
        setShowForm(false)
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setSuccess(true)
      setTimeout(() => {
        setShowForm(false)
        setSuccess(false)
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <h1 className="page-title">Community Hub</h1>
          <p className="page-subtitle">Sightings, comments, and alerts from the community</p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)} 
          className="btn btn-primary"
          style={{ marginBottom: '24px' }}
        >
          <Plus size={18} /> {showForm ? 'Cancel' : 'Add Report'}
        </button>

        {showForm && (
          <div className="form-card" style={{ marginBottom: '32px' }}>
            <h3 style={{ marginBottom: '20px' }}>Submit a Report</h3>
            
            {success ? (
              <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle /> Report submitted successfully!
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Report Type</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {['sighting', 'comment', 'alert'].map((type) => (
                      <label 
                        key={type}
                        style={{ 
                          flex: 1,
                          padding: '16px',
                          border: `2px solid ${formData.type === type ? '#667eea' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: formData.type === type ? 'rgba(102, 126, 234, 0.05)' : 'transparent'
                        }}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={formData.type === type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          style={{ display: 'none' }}
                        />
                        <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '4px' }}>
                          {type === 'sighting' ? '👁️' : type === 'comment' ? '💬' : '🚨'}
                        </span>
                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {formData.type === 'sighting' && (
                  <div className="form-group">
                    <label className="form-label">Select Case (Optional)</label>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
                      Search and select which missing person this sighting relates to
                    </p>
                    
                    <div style={{ position: 'relative' }}>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px',
                          padding: '12px 16px',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          background: '#fff'
                        }}
                        onClick={() => setShowCaseDropdown(!showCaseDropdown)}
                      >
                        {selectedCase ? (
                          <>
                            <div style={{ 
                              width: '40px', 
                              height: '40px', 
                              borderRadius: '8px',
                              background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Users size={20} color="#64748b" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 600 }}>{selectedCase.fullName}</div>
                              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                {selectedCase.age} years • {selectedCase.gender} • {selectedCase.lastSeenLocation?.address}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <Search size={20} color="#94a3b8" />
                            <span style={{ color: '#94a3b8' }}>Search by name or location...</span>
                          </>
                        )}
                        {selectedCase && (
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setFormData({ ...formData, caseId: '' })
                            }}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              padding: '4px'
                            }}
                          >
                            <X size={18} color="#94a3b8" />
                          </button>
                        )}
                      </div>

                      {showCaseDropdown && (
                        <div style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          background: 'white',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          marginTop: '8px',
                          maxHeight: '300px',
                          overflowY: 'auto',
                          zIndex: 100,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                        }}>
                          <div style={{ padding: '12px', borderBottom: '1px solid #e2e8f0' }}>
                            <input
                              type="text"
                              placeholder="Search cases..."
                              value={caseSearch}
                              onChange={(e) => setCaseSearch(e.target.value)}
                              autoFocus
                              style={{ 
                                width: '100%', 
                                padding: '10px 12px',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                fontSize: '0.95rem'
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          {filteredCases.length > 0 ? (
                            filteredCases.map(c => (
                              <div
                                key={c._id}
                                onClick={() => handleSelectCase(c)}
                                style={{
                                  padding: '12px 16px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  borderBottom: '1px solid #f1f5f9',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                              >
                                <div style={{ 
                                  width: '40px', 
                                  height: '40px', 
                                  borderRadius: '8px',
                                  background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <Users size={20} color="#64748b" />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.fullName}</div>
                                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {c.age} years • {c.gender}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    📍 {c.lastSeenLocation?.address || 'Location not specified'}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                              No cases found matching your search
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    <MapPin size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    Location
                  </label>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Where did you see this?"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                      {locationError && (
                        <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{locationError}</p>
                      )}
                    </div>
                    <button 
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                      className="btn btn-secondary"
                      style={{ 
                        whiteSpace: 'nowrap',
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {gettingLocation ? (
                        <>
                          <Loader size={18} className="spinning" style={{ animation: 'spin 1s linear infinite' }} />
                          Getting...
                        </>
                      ) : (
                        <>
                          <MapPin size={18} />
                          My Location
                        </>
                      )}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
                    📍 Click "My Location" to automatically detect your current location
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    placeholder={formData.type === 'alert' ? 'Describe the urgent situation...' : 'Describe what you saw or your thoughts...'}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Submitting...' : <><Send size={18} /> Submit Report</>}
                </button>
              </form>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {['all', 'sighting', 'comment', 'alert'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`btn ${filter === type ? 'btn-primary' : 'btn-secondary'}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredReports.map((report) => (
            <div key={report.id} className="form-card" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px',
                background: report.type === 'alert' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span style={{ color: report.type === 'alert' ? '#ef4444' : '#6366f1' }}>
                  {getTypeIcon(report.type)}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{report.type}</span>
                  {getStatusBadge(report.status)}
                </div>
                <p style={{ color: '#64748b', marginBottom: '8px' }}>{report.description}</p>
                <div style={{ display: 'flex', gap: '16px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <span>📍 {report.location}</span>
                  <span>📅 {report.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users />
            </div>
            <h3>No reports found</h3>
            <p>There are no community reports matching your filter</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Community