import { useState, useEffect, useContext } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { AuthContext } from '../App'
import L from 'leaflet'

function MapView() {
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const { API_URL } = useContext(AuthContext)

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const res = await axios.get(`${API_URL}/cases?status=Active`)
      setCases(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const defaultCenter = [20.5937, 78.9629]
  const defaultZoom = 5

  return (
    <div className="map-view">
      <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {cases.map(caseItem => {
          const lat = caseItem.lastSeenLocation?.coordinates?.[1]
          const lng = caseItem.lastSeenLocation?.coordinates?.[0]
          
          if (!lat || !lng) return null
          
          return (
            <Marker 
              key={caseItem._id} 
              position={[lat, lng]}
            >
              <Popup>
                <div style={{ minWidth: '200px' }}>
                  <h4 style={{ marginBottom: '8px', color: '#1D3557' }}>{caseItem.fullName}</h4>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                    <strong>Age:</strong> {caseItem.age} | <strong>Gender:</strong> {caseItem.gender}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                    <strong>Last Seen:</strong> {caseItem.lastSeenLocation?.address || 'Not specified'}
                  </p>
                  <p style={{ margin: '4px 0', fontSize: '0.9rem' }}>
                    <strong>Status:</strong> {caseItem.status}
                  </p>
                  <Link 
                    to={`/cases/${caseItem._id}`}
                    style={{ 
                      display: 'inline-block', 
                      marginTop: '10px',
                      color: '#E63946',
                      fontWeight: '600'
                    }}
                  >
                    View Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'white',
        padding: '15px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <h4 style={{ marginBottom: '10px', color: '#1D3557' }}>Active Cases: {cases.length}</h4>
        <p style={{ fontSize: '0.85rem', color: '#6C757D', margin: 0 }}>
          Click on markers to view case details
        </p>
      </div>

      {loading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          background: 'white',
          padding: '20px 40px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
        }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '10px', textAlign: 'center' }}>Loading cases...</p>
        </div>
      )}
    </div>
  )
}

export default MapView