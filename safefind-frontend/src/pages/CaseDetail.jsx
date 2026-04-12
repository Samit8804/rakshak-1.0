import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, User, Calendar, MapPin, FileText, Send } from 'lucide-react'

const mockCaseDetails = {
  1: {
    name: 'Sarah Johnson',
    age: 24,
    gender: 'Female',
    location: 'Mumbai, Maharashtra',
    dateMissing: '2024-01-15',
    description: 'Last seen wearing a blue denim jacket and black jeans. Has a small tattoo on her left wrist. Brown hair, about 5\'6" tall.',
    status: 'active',
    images: []
  },
  2: {
    name: 'Priya Sharma',
    age: 19,
    gender: 'Female',
    location: 'Delhi, NCR',
    dateMissing: '2024-01-20',
    description: 'Last seen near Connaught Place. Was wearing a pink salwar kameez. Black hair, about 5\'3" tall.',
    status: 'active',
    images: []
  },
  3: {
    name: 'Anita Verma',
    age: 32,
    gender: 'Female',
    location: 'Bangalore, Karnataka',
    dateMissing: '2024-01-10',
    description: 'Found safe! Thank you for your help.',
    status: 'found',
    images: []
  },
}

const mockSightings = [
  { id: 1, location: 'Mumbai Central', description: 'Spotted near railway station', date: '2024-01-16', status: 'verified' },
  { id: 2, location: 'Andheri West', description: 'Seen at a local market', date: '2024-01-17', status: 'pending' },
]

function CaseDetail() {
  const { id } = useParams()
  const caseData = mockCaseDetails[id] || mockCaseDetails[1]
  const [showSightingForm, setShowSightingForm] = useState(false)
  const [sightingData, setSightingData] = useState({ location: '', description: '' })
  const [sightingSubmitted, setSightingSubmitted] = useState(false)

  const handleSightingSubmit = (e) => {
    e.preventDefault()
    setSightingSubmitted(true)
    setTimeout(() => {
      setShowSightingForm(false)
      setSightingSubmitted(false)
      setSightingData({ location: '', description: '' })
    }, 2000)
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <Link to="/cases" className="back-btn">
            <ArrowLeft /> Back to Cases
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '24px' }}>
          <div>
            <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ 
                height: '300px', 
                background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={80} color="#94a3b8" />
              </div>
              <div style={{ padding: '24px' }}>
                <span className={`case-status ${caseData.status}`} style={{ display: 'inline-block', marginBottom: '16px' }}>
                  {caseData.status === 'active' ? 'Active Case' : 'Found'}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>{caseData.name}</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                    <User size={18} /> <span>Age: {caseData.age} • {caseData.gender}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                    <Calendar size={18} /> <span>Missing since: {caseData.dateMissing}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                    <MapPin size={18} /> <span>{caseData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="form-card">
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Description</h3>
              <p style={{ color: '#64748b', lineHeight: 1.7 }}>{caseData.description}</p>
              
              <button 
                onClick={() => setShowSightingForm(!showSightingForm)}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '24px' }}
              >
                <Send size={18} /> Report Sighting
              </button>
            </div>

            {showSightingForm && (
              <div className="form-card" style={{ marginTop: '16px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Report a Sighting</h3>
                {sightingSubmitted ? (
                  <div className="alert alert-success">Sighting reported successfully!</div>
                ) : (
                  <form onSubmit={handleSightingSubmit}>
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        value={sightingData.location}
                        onChange={(e) => setSightingData({ ...sightingData, location: e.target.value })}
                        className="form-input"
                        placeholder="Where did you see this person?"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                        value={sightingData.description}
                        onChange={(e) => setSightingData({ ...sightingData, description: e.target.value })}
                        className="form-input form-textarea"
                        placeholder="Describe what you saw..."
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full">Submit Report</button>
                  </form>
                )}
              </div>
            )}

            <div className="form-card" style={{ marginTop: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>Reported Sightings</h3>
              {mockSightings.map((sighting) => (
                <div key={sighting.id} style={{ 
                  padding: '16px', 
                  background: '#f8fafc', 
                  borderRadius: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{sighting.location}</span>
                    <span className={`case-status ${sighting.status === 'verified' ? 'found' : 'active'}`}>
                      {sighting.status}
                    </span>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{sighting.description}</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '8px' }}>{sighting.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CaseDetail