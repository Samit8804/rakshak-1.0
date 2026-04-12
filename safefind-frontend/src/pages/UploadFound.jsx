import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Upload, CheckCircle, AlertTriangle, Loader } from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

function UploadFound() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [matches, setMatches] = useState([])
  const [backendStatus, setBackendStatus] = useState('checking')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!image) {
      setError('Please upload an image')
      return
    }

    setLoading(true)
    setError('')
    setBackendStatus('checking')

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('location', location)
      formData.append('description', description)

      const res = await axios.post(`${API_URL}/cases`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const uploadedPath = res.data.images?.[0]
      
      if (uploadedPath) {
        const matchRes = await axios.post(`${API_URL}/ai/match`, {
          imagePath: uploadedPath
        })

        if (matchRes.data.matches?.length > 0) {
          setMatches(matchRes.data.matches)
          setSuccess(true)
          setBackendStatus('connected')
        } else {
          setSuccess(true)
          setMatches([])
          setBackendStatus('connected')
        }
      }
    } catch (err) {
      console.log('Backend not connected, showing demo')
      setBackendStatus('disconnected')
      setTimeout(() => {
        setMatches([
          { caseId: '1', name: 'Sarah Johnson', similarity: 87, status: 'Active', image: '' },
          { caseId: '2', name: 'Priya Sharma', similarity: 72, status: 'Active', image: '' },
          { caseId: '3', name: 'Anita Verma', similarity: 65, status: 'Found', image: '' },
        ])
        setSuccess(true)
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setImage(null)
    setPreview(null)
    setLocation('')
    setDescription('')
    setSuccess(false)
    setMatches([])
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <h1 className="page-title">Face Detection</h1>
          <p className="page-subtitle">Upload a photo to find potential matches using AI face recognition</p>
        </div>

        <div className="backend-status-bar" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '12px 20px',
          background: backendStatus === 'connected' ? 'rgba(16, 185, 129, 0.1)' : backendStatus === 'disconnected' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(99, 102, 241, 0.1)',
          borderRadius: '12px',
          marginBottom: '24px',
          fontSize: '0.9rem'
        }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%',
            background: backendStatus === 'connected' ? '#10b981' : backendStatus === 'disconnected' ? '#f59e0b' : '#6366f1'
          }}></div>
          <span style={{ color: '#64748b' }}>
            {backendStatus === 'checking' && 'Checking backend connection...'}
            {backendStatus === 'connected' && '✅ Backend connected - AI face detection active'}
            {backendStatus === 'disconnected' && '⚠️ Running in demo mode - Connect backend for real face detection'}
          </span>
        </div>

        <div className="form-container">
          {error && <div className="alert alert-error">{error}</div>}

          {success && matches.length > 0 && (
            <div className="matches-container">
              <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircle /> Potential matches found!
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>Match Results</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  The AI has found {matches.length} potential match(es) based on facial recognition
                </p>
              </div>
               
              {matches.map((match, idx) => (
                <Link to={`/cases/${match.caseId}`} key={idx} className="match-result-card">
                  <div className="case-image placeholder" style={{ width: 80, height: 80, borderRadius: '50%' }}>
                    <Upload size={32} />
                  </div>
                  <div className="match-result-info">
                    <h3>{match.name}</h3>
                    <div className="match-percentage">
                      <span className="match-percentage-value">{match.similarity}%</span>
                      <div className="match-percentage-bar">
                        <div className="match-percentage-fill" style={{ width: `${match.similarity}%` }}></div>
                      </div>
                    </div>
                    {match.similarity >= 70 && (
                      <span style={{ 
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: '4px 12px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        🔥 High Probability Match
                      </span>
                    )}
                  </div>
                  <span className={`match-status-badge case-status ${match.status?.toLowerCase() || 'active'}`}>
                    {match.status || 'Active'}
                  </span>
                </Link>
              ))}
              
              <button onClick={resetForm} className="btn btn-secondary btn-full" style={{ marginTop: '20px' }}>
                Upload Another Image
              </button>
            </div>
          )}

          {success && matches.length === 0 && (
            <div className="form-card">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  margin: '0 auto 20px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={40} color="#f59e0b" />
                </div>
                <h3 style={{ marginBottom: '12px' }}>No Matches Found</h3>
                <p style={{ color: '#64748b' }}>
                  The uploaded image did not match any missing persons in our database.<br/>
                  The image has been saved for future comparisons.
                </p>
              </div>
              <button onClick={resetForm} className="btn btn-primary btn-full">
                Upload Another Image
              </button>
            </div>
          )}

          {!success && (
            <form className="form-card" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Upload Photo *</label>
                <div 
                  className={`image-upload-area ${preview ? 'has-image' : ''}`}
                  onClick={() => document.getElementById('found-image-input').click()}
                >
                  <input
                    id="found-image-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  {preview ? (
                    <img src={preview} alt="Preview" className="preview-image" />
                  ) : (
                    <>
                      <div className="image-upload-icon">
                        <Upload />
                      </div>
                      <p className="image-upload-text">
                        <span>Click to upload</span> photo of found person
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '8px' }}>
                        Supported: JPG, PNG, WebP (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Location (Optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-input"
                  placeholder="Where was this person found?"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                  placeholder="Any additional details about the person..."
                />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader size={18} className="spinning" /> Processing Face Detection...
                  </>
                ) : (
                  <>
                    <Upload size={18} /> Find Matches
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadFound