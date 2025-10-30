import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, CardMedia, CardContent, Typography, Grid, Button, Box, Chip } from '@mui/material';

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/api/events').then(res => {
      if (res.data.success) setEvents(res.data.events);
    });
  }, []);

  return (
    <Box sx={{ p: 4, background: '#f8fafc', minHeight: '100vh' }}>
      <Typography variant="h3" fontWeight="700" textAlign="center" color="#2563eb" mb={4}>
        🎉 Upcoming College Events
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {events.map(event => (
          <Grid item xs={12} sm={6} md={4} key={event._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { transform: 'scale(1.03)' }
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={event.banner || '/assets/event-default.jpg'}
                alt={event.title}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                  {event.description?.substring(0, 80)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip label={event.category} color="primary" size="small" />
                  <Chip label={new Date(event.date).toDateString()} size="small" />
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 1,
                    background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                    fontWeight: 600
                  }}
                  href={`/events/${event._id}`}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EventsPage;
