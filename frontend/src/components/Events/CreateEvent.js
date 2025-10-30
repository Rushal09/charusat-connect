import React, { useState } from 'react';

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    category: 'workshop',
    organizer: '',
    venue: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating event:', eventData);
    alert('Event creation functionality coming soon!');
  };

  return (
    <div className="create-event" style={{ padding: '2rem', minHeight: '100vh', background: '#f8fafc' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '2rem' }}>Create New Event</h1>
        
        <form onSubmit={handleSubmit} style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
        }}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Event Title</label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleInputChange}
                rows="4"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                placeholder="Describe your event"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  <option value="workshop">🔧 Workshop</option>
                  <option value="fest">🎉 Fest</option>
                  <option value="seminar">📚 Seminar</option>
                  <option value="competition">🏆 Competition</option>
                  <option value="cultural">🎭 Cultural</option>
                  <option value="sports">⚽ Sports</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Organizer</label>
                <input
                  type="text"
                  name="organizer"
                  value={eventData.organizer}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                  placeholder="Department/Club name"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Venue</label>
              <input
                type="text"
                name="venue"
                value={eventData.venue}
                onChange={handleInputChange}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                placeholder="Event venue"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={eventData.startDate}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={eventData.endDate}
                  onChange={handleInputChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button 
              type="submit"
              style={{ 
                background: '#2563eb', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                border: 'none', 
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Create Event
            </button>
            <button 
              type="button"
              style={{ 
                background: '#f1f5f9', 
                color: '#475569', 
                padding: '0.75rem 1.5rem', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
