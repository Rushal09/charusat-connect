import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Card, CardContent, Box, Typography, Grid, Button, Avatar, Chip } from '@mui/material';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    api.get('/api/clubs').then(res => {
      if (res.data.success) setClubs(res.data.clubs);
    });
  }, []);

  return (
    <Box sx={{ p: 4, background: '#f9fafb', minHeight: '100vh' }}>
      <Typography variant="h3" fontWeight="700" textAlign="center" color="#7c3aed" mb={5}>
        👥 College Clubs & Communities
      </Typography>
      <Grid container spacing={3}>
        {clubs.map(club => (
          <Grid item xs={12} sm={6} md={4} key={club._id}>
            <Card
              sx={{
                borderRadius: 3,
                py: 2,
                px: 3,
                boxShadow: '0 8px 20px rgba(124,58,237,0.15)',
                '&:hover': { transform: 'translateY(-5px)', transition: '0.3s' }
              }}
            >
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar src={club.icon || '/assets/club-icon.png'} sx={{ width: 60, height: 60 }} />
                <Box>
                  <Typography variant="h6" fontWeight="700">
                    {club.name}
                  </Typography>
                  <Chip label={club.category} size="small" color="secondary" />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {club.description?.substring(0, 100)}...
              </Typography>
              <Typography variant="body2" mb={1}>📧 {club.email}</Typography>
              <Typography variant="body2" mb={1}>👤 President: {club.president}</Typography>
              <Typography variant="body2" mb={2}>👥 Members: {club.membersCount}</Typography>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
                  fontWeight: 600
                }}
                href={`/clubs/${club._id}`}
              >
                Explore Club
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClubsPage;
