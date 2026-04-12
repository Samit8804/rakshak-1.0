import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Heart, Users, Target, Code, Mail, Phone, MapPin } from 'lucide-react'

function About() {
  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <Link to="/" className="back-btn">
            <ArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="page-title">About SafeFind</h1>
          <p className="page-subtitle">Learn more about our mission and the platform</p>
        </div>

        <div className="form-card" style={{ marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Shield size={50} color="white" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '12px' }}>SafeFind</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              A revolutionary platform dedicated to helping find missing persons and reuniting families. 
              We combine modern technology with community power to make a difference.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', marginBottom: '24px' }}>
          <div className="form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #14b8a6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Our Mission</h3>
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.7 }}>
              To leverage advanced technology including AI-powered face recognition to help locate missing persons 
              and provide a platform for community involvement in the search process.
            </p>
          </div>

          <div className="form-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Heart size={24} color="white" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Our Vision</h3>
            </div>
            <p style={{ color: '#64748b', lineHeight: 1.7 }}>
              A world where no family has to endure the pain of a missing loved one. We strive to make 
              finding missing persons faster, easier, and more effective through technology.
            </p>
          </div>
        </div>

        <div className="form-card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '24px' }}>Key Features</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { icon: Users, title: 'Community Reports', desc: 'Anyone can report sightings' },
              { icon: Heart, title: 'Face Recognition', desc: 'AI-powered matching' },
              { icon: MapPin, title: 'Map Integration', desc: 'Visual case tracking' },
              { icon: Shield, title: 'Secure Platform', desc: 'Protected user data' },
            ].map((feature, index) => (
              <div key={index} style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  margin: '0 auto 12px',
                  background: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <feature.icon size={28} color="#6366f1" />
                </div>
                <h4 style={{ fontWeight: 600, marginBottom: '4px' }}>{feature.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="form-card">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '24px' }}>Contact Us</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Mail size={18} color="#6366f1" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Email</p>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>support@safefind.in</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone size={18} color="#6366f1" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Phone</p>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>+91 98765 43210</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MapPin size={18} color="#6366f1" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Address</p>
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Mumbai, Maharashtra, India</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>Join Our Mission</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Together, we can make a difference in people's lives
          </p>
          <Link to="/report-missing" className="btn btn-primary">Report a Case</Link>
        </div>
      </div>
    </div>
  )
}

export default About