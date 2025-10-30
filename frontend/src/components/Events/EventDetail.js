import React from 'react';

const EventDetail = () => {
  return (
    <div className="event-detail" style={{ padding: '2rem', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '1rem' }}>Event Details</h1>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2>🎉 Tech Fest 2025</h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Detailed event information will be displayed here with registration options, gallery, and more details.</p>
          
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
              <h4>📅 Date & Time</h4>
              <p>Oct 15-17, 2025</p>
            </div>
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
              <h4>📍 Location</h4>
              <p>Main Auditorium</p>
            </div>
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px' }}>
              <h4>🎫 Registration</h4>
              <p>₹100 - Required</p>
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button style={{ 
              background: '#2563eb', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Register Now
            </button>
            <button style={{ 
              background: '#f1f5f9', 
              color: '#475569', 
              padding: '0.75rem 1.5rem', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Share Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
