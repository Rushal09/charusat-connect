import React from 'react';

const ClubDetail = () => {
  return (
    <div className="club-detail" style={{ padding: '2rem', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Club Header */}
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ 
              fontSize: '3rem', 
              width: '80px', 
              height: '80px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#f1f5f9',
              borderRadius: '16px'
            }}>
              💻
            </div>
            <div>
              <h1 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>Data Science Club</h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                Exploring the world of data science, machine learning, and AI
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{ color: '#059669', fontWeight: '500' }}>👥 150 Members</span>
                <span style={{ color: '#7c3aed', fontWeight: '500' }}>📅 5 Upcoming Events</span>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={{ 
              background: '#2563eb', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Join Club
            </button>
            <button style={{ 
              background: '#f1f5f9', 
              color: '#475569', 
              padding: '0.75rem 1.5rem', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Follow Updates
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {/* About */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '1rem' }}>📋 About</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6 }}>
              We are a community of data enthusiasts passionate about exploring machine learning, 
              artificial intelligence, and data analytics. Join us for workshops, competitions, 
              and collaborative projects.
            </p>
          </div>

          {/* Upcoming Events */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '1rem' }}>🗓️ Upcoming Events</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>AI/ML Workshop</h4>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Sep 25, 2025</p>
              </div>
              <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '6px' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Data Visualization Contest</h4>
                <p style={{ color: '#64748b', fontSize: '0.8rem' }}>Oct 5, 2025</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}>
            <h3 style={{ marginBottom: '1rem' }}>📞 Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <p style={{ color: '#64748b' }}>📧 datascienceclub@charusat.ac.in</p>
              <p style={{ color: '#64748b' }}>📱 WhatsApp Group Available</p>
              <p style={{ color: '#64748b' }}>📍 Room 301, IT Block</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
