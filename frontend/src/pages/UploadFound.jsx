import { useState, useContext, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App'

function UploadFound() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [matches, setMatches] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { API_URL } = useContext(AuthContext)
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
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
    setMatches([])

    try {
      const formData = new FormData()
      formData.append('image', image)

      const uploadRes = await axios.post(`${API_URL}/cases`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      const uploadedPath = uploadRes.data.images?.[0]
      
      if (uploadedPath) {
        const matchRes = await axios.post(`${API_URL}/ai/match`, {
          imagePath: uploadedPath
        })

        if (matchRes.data.matches?.length > 0) {
          setMatches(matchRes.data.matches)
          setSuccess(true)
        } else {
          setSuccess(true)
          setMatches([])
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process image')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setImage(null)
    setPreview(null)
    setLocation('')
    setDescription('')
    setMatches([])
    setSuccess(false)
    setError('')
  }

  return (
    <div className="section">
      <div className="container">
        <div className="form-container">
          <h2>Upload Found Person</h2>
          <p style={{ textAlign: 'center', marginBottom: '30px', color: '#6C757D' }}>
            Upload a photo of a person you found. Our AI will search for potential matches.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          {success && matches.length > 0 && (
            <div className="results-container">
              <h3 style={{ marginBottom: '20px', color: '#1D3557' }}>Potential Matches Found!</h3>
              {matches.map((match, idx) => (
                <Link to={`/cases/${match.caseId}`} key={idx} className="match-card">
                  {match.image && (
                    <img src={`http://localhost:5000${match.image}`} alt={match.name} />
                  )}
                  <div className="match-info">
                    <h4>{match.name}</h4>
                    <div className="match-similarity">
                      <span className="match-percentage">{match.similarity}%</span>
                      <div className="match-bar">
                        <div className="match-bar-fill" style={{ width: `${match.similarity}%` }}></div>
                      </div>
                    </div>
                    <span className={`case-status ${match.status?.toLowerCase()}`}>
                      {match.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {success && matches.length === 0 && (
            <div className="alert alert-warning" style={{ textAlign: 'center' }}>
              <h3>No Matches Found</h3>
              <p>The uploaded image did not match any missing persons in our database.</p>
              <p>We will keep this image for future comparisons.</p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              <div 
                className="image-upload"
                onClick={() => fileInputRef.current?.click()}
                style={{ borderColor: preview ? '#2A9D8F' : '#ccc' }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {preview ? (
                  <img src={preview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px' }} />
                ) : (
                  <>
                    <div className="image-upload-icon">📷</div>
                    <p>Click to upload photo of found person</p>
                  </>
                )}
              </div>

              <div className="input-group">
                <label>Location (optional)</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where was this person found?"
                />
              </div>

              <div className="input-group">
                <label>Description (optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Any additional details about the person..."
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Processing...' : 'Find Matches'}
              </button>
            </form>
          )}

          {success && (
            <button 
              onClick={resetForm} 
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '20px' }}
            >
              Upload Another
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadFound