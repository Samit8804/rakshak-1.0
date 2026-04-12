import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Upload, Calendar, MapPin, FileText, CheckCircle } from 'lucide-react'

const API_URL = 'http://localhost:5000/api'

function ReportMissing() {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    dateMissing: '',
    description: '',
    address: ''
  })
  const [images, setImages] = useState([])
  const [previews, setPreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }
    setImages([...images, ...files])
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = previews.filter((_, i) => i !== index)
    setImages(newImages)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

      const data = new FormData()
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key])
      })
      images.forEach(img => {
        data.append('images', img)
      })

      await axios.post(`${API_URL}/cases`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        ...config
      })

      setLoading(false)
      setSuccess(true)
      
      setTimeout(() => {
        navigate('/cases')
      }, 2000)

    } catch (err) {
      setLoading(false)
      if (err.response?.status === 401) {
        setError('Please login to submit a report')
      } else {
        setError(err.response?.data?.message || 'Failed to submit report')
      }
    }
  }

  if (success) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="form-container">
            <div className="form-card" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                margin: '0 auto 20px',
                background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={40} color="white" />
              </div>
              <h2 style={{ marginBottom: '12px' }}>Report Submitted!</h2>
              <p style={{ color: '#64748b' }}>Your report has been submitted successfully. Redirecting to cases...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="back-btn">
            <ArrowLeft size={20} /> Back to Dashboard
          </Link>
          <h1 className="page-title">Report Missing Person</h1>
          <p className="page-subtitle">Fill in the details to file a missing person report</p>
        </div>

        <div className="form-container">
          <form className="form-card" onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter person's full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter age"
                  min="1"
                  max="150"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Date Missing *
                </label>
                <input
                  type="date"
                  name="dateMissing"
                  value={formData.dateMissing}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Last Seen Location
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="City, State"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <FileText size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Clothing, height, distinguishing features..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Photos (Max 5)</label>
              <div 
                className="image-upload-area"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                {previews.length === 0 ? (
                  <>
                    <div className="image-upload-icon">
                      <Upload size={28} />
                    </div>
                    <p style={{ color: '#64748b' }}>
                      <span style={{ color: '#667eea', fontWeight: 600 }}>Click to upload</span> or drag and drop
                    </p>
                  </>
                ) : (
                  <div className="image-preview-grid">
                    {previews.map((preview, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={preview} alt={`Preview ${index + 1}`} />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeImage(index)
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <div 
                        className="image-preview-item"
                        style={{ 
                          border: '2px dashed #cbd5e1', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload size={24} color="#94a3b8" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportMissing