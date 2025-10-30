import React from 'react';

const MyEvents = () => {
  const registeredEvents = [
    { id: 1, title: 'AI/ML Workshop', date: 'Sep 25, 2025', status: 'registered' },
    { id: 2, title: 'Tech Fest 2025', date: 'Oct 15, 2025', status: 'registered' }
  ];

  const createdEvents = [
    { id: 3, title: 'React Development Workshop', date: 'Nov 10, 2025', status: 'published' }
  ];

  return (
    <div className="my-events" style={{ padding: '2rem', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '2rem' }}>My Events</h1>
        
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          {/* Registered Events */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}>
            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🎫 Registered Events
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {registeredEvents.map(event => (
                <div key={event.id} style={{ 
                  padding: '1rem', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{event.title}</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{event.date}</p>
                  </div>
                  <span style={{ 
                    background: '#dcfce7', 
                    color: '#166534', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Created Events */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
          }}>
            <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📝 Created Events
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {createdEvents.map(event => (
                <div key={event.id} style={{ 
                  padding: '1rem', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>{event.title}</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{event.date}</p>
                  </div>
                  <span style={{ 
                    background: '#dbeafe', 
                    color: '#1d4ed8', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          marginTop: '2rem', 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button style={{ 
              background: '#2563eb', 
              color: 'white', 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Create New Event
            </button>
            <button style={{ 
              background: '#f1f5f9', 
              color: '#475569', 
              padding: '0.75rem 1.5rem', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              Browse Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
