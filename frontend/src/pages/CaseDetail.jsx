import { useState, useEffect, useContext } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../App'

function CaseDetail() {
  const { id } = useParams()
  const [caseData, setCaseData] = useState(null)
  const [sightings, setSightings] = useState([])
  const [selectedImage, setSelectedImage] = useState(0)
  const [showSightingModal, setShowSightingModal] = useState(false)
  const [sightingForm, setSightingForm] = useState({ location: '', description: '' })
  const [sightingImage, setSightingImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sightingLoading, setSightingLoading] = useState(false)
  const { user, API_URL } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    fetchCaseData()
  }, [id])

  const fetchCaseData = async () => {
    try {
      const [caseRes, sightingsRes] = await Promise.all([
        axios.get(`${API_URL}/cases/${id}`),
        axios.get(`${API_URL}/sightings/case/${id}`)
      ])
      setCaseData(caseRes.data)
      setSightings(sightingsRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSightingSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    setSightingLoading(true)
    try {
      const formData = new FormData()
      formData.append('caseId', id)
      formData.append('location', sightingForm.location)
      formData.append('description', sightingForm.description)
      if (sightingImage) {
        formData.append('image', sightingImage)
      }

      await axios.post(`${API_URL}/sightings`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setShowSightingModal(false)
      setSightingForm({ location: '', description: '' })
      setSightingImage(null)
      fetchCaseData()
    } catch (err) {
      console.error(err)
    } finally {
      setSightingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="section">
        <div className="container">
          <div className="alert alert-error">Case not found</div>
          <Link to="/cases" className="btn btn-primary">Back to Cases</Link>
        </div>
      </div>
    )
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="detail-page">
      <div className="container">
        <Link to="/cases" className="btn btn-outline" style={{ marginBottom: '20px' }}>
          ← Back to Cases
        </Link>

        <div className="detail-header">
          <div className="detail-images">
            {caseData.images?.length > 0 ? (
              <>
                <img 
                  src={`http://localhost:5000${caseData.images[selectedImage]}`} 
                  alt={caseData.fullName}
                  className="detail-main-image"
                />
                <div className="detail-thumbnails">
                  {caseData.images.map((img, idx) => (
                    <img 
                      key={idx}
                      src={`http://localhost:5000${img}`} 
                      alt={`${caseData.fullName} ${idx + 1}`}
                      className={selectedImage === idx ? 'active' : ''}
                      onClick={() => setSelectedImage(idx)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div style={{ 
                width: '100%', 
                height: '400px', 
                background: '#eee', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '12px'
              }}>
                <span style={{ color: '#999', fontSize: '1.2rem' }}>No Image Available</span>
              </div>
            )}
          </div>

          <div className="detail-info">
            <h1>{caseData.fullName}</h1>
            <span className={`case-status ${caseData.status?.toLowerCase()}`} style={{ display: 'inline-block', marginBottom: '20px' }}>
              {caseData.status}
            </span>

            <div className="detail-meta">
              <div className="detail-meta-item">
                <span>👤</span>
                <strong>Age:</strong> {caseData.age} years
              </div>
              <div className="detail-meta-item">
                <span>⚥</span>
                <strong>Gender:</strong> {caseData.gender}
              </div>
              <div className="detail-meta-item">
                <span>📅</span>
                <strong>Date Missing:</strong> {formatDate(caseData.dateMissing)}
              </div>
              <div className="detail-meta-item">
                <span>📍</span>
                <strong>Last Seen:</strong> {caseData.lastSeenLocation?.address || 'Not specified'}
              </div>
            </div>

            <div className="detail-description">
              <h3>Description</h3>
              <p>{caseData.description || 'No description provided'}</p>
            </div>

            <button onClick={() => setShowSightingModal(true)} className="btn btn-primary">
              Report Sighting
            </button>
          </div>
        </div>

        <div className="sightings-section">
          <h2>Reported Sightings</h2>
          {sightings.length > 0 ? (
            sightings.map(sighting => (
              <div key={sighting._id} className="sighting-card">
                {sighting.image && (
                  <img src={`http://localhost:5000${sighting.image}`} alt="Sighting" />
                )}
                <div className="sighting-info">
                  <h4>Sighting Report</h4>
                  <span className={`sighting-status ${sighting.status?.toLowerCase()}`}>
                    {sighting.status}
                  </span>
                  {sighting.location && (
                    <p><strong>Location:</strong> {sighting.location}</p>
                  )}
                  {sighting.description && (
                    <p><strong>Description:</strong> {sighting.description}</p>
                  )}
                  <p style={{ fontSize: '0.85rem', color: '#6C757D', marginTop: '8px' }}>
                    Reported by: {sighting.reportedBy?.username || 'Anonymous'} on {formatDate(sighting.createdAt)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '12px' }}>
              <p style={{ color: '#6C757D' }}>No sightings reported yet</p>
            </div>
          )}
        </div>
      </div>

      {showSightingModal && (
        <div className="modal-overlay" onClick={() => setShowSightingModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Report a Sighting</h3>
            <form onSubmit={handleSightingSubmit}>
              <div className="image-upload" onClick={() => document.getElementById('sighting-input').click()}>
                <input 
                  id="sighting-input" 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setSightingImage(e.target.files[0])}
                />
                <div className="image-upload-icon">📷</div>
                <p>{sightingImage ? sightingImage.name : 'Click to upload image (optional)'}</p>
              </div>

              <div className="input-group">
                <label>Location</label>
                <input 
                  type="text"
                  value={sightingForm.location}
                  onChange={(e) => setSightingForm({ ...sightingForm, location: e.target.value })}
                  placeholder="Where was this person seen?"
                />
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea 
                  value={sightingForm.description}
                  onChange={(e) => setSightingForm({ ...sightingForm, description: e.target.value })}
                  placeholder="Describe what you saw..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowSightingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={sightingLoading}>
                  {sightingLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CaseDetail