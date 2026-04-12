import { useState, useContext, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { AuthContext } from '../App'
import L from 'leaflet'

function LocationPicker({ onLocationChange, initialPosition }) {
  const [position, setPosition] = useState(initialPosition || [28.6139, 77.2090])
  
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng])
      onLocationChange(e.latlng.lat, e.latlng.lng)
    }
  })

  return position[0] !== 0 ? <Marker position={position} /> : null
}

function ReportMissing() {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    dateMissing: '',
    description: '',
    lat: '',
    lng: '',
    address: ''
  })
  const [images, setImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mapCenter, setMapCenter] = useState([28.6139, 77.2090])
  const { user, API_URL } = useContext(AuthContext)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }
    setImages([...images, ...files])
    
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...previews])
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleLocationChange = (lat, lng) => {
    setFormData({ ...formData, lat: lat.toString(), lng: lng.toString() })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key])
      })
      images.forEach(img => {
        data.append('images', img)
      })

      const res = await axios.post(`${API_URL}/cases`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.data.faceEncoding) {
        const firstImage = `/uploads/cases/${res.data.images?.[0]?.split('/').pop()}`
        try {
          await axios.post(`${API_URL}/ai/encode-and-store/${res.data._id}`, {
            imagePath: res.data.images?.[0]
          })
        } catch (err) {
          console.log('Face encoding will be processed separately')
        }
      }

      setSuccess(true)
      setTimeout(() => navigate('/cases'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="section">
        <div className="container">
          <div className="alert alert-success" style={{ textAlign: 'center' }}>
            <h3>Report Submitted Successfully!</h3>
            <p>Redirecting to cases page...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container">
        <div className="form-container">
          <h2>Report Missing Person</h2>
          
          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                placeholder="Enter full name"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="input-group">
                <label>Age *</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                  min="1"
                  max="150"
                  placeholder="Age"
                />
              </div>

              <div className="input-group">
                <label>Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Date Missing *</label>
              <input
                type="date"
                value={formData.dateMissing}
                onChange={(e) => setFormData({ ...formData, dateMissing: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label>Last Seen Location</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address or click on map"
              />
              <div className="map-picker">
                <MapContainer 
                  center={mapCenter} 
                  zoom={12} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker onLocationChange={handleLocationChange} initialPosition={mapCenter} />
                </MapContainer>
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Clothes, height, distinguishing features..."
              />
            </div>

            <div className="input-group">
              <label>Photos (up to 5)</label>
              <div 
                className="image-upload"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="image-upload-icon">📷</div>
                <p>Click to upload images</p>
              </div>
              
              {imagePreviews.length > 0 && (
                <div className="image-preview">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img src={preview} alt={`Preview ${idx + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ReportMissing