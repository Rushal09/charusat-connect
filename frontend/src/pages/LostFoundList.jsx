import React, { useEffect } from 'react';
import {
  Container, Grid, Card, CardMedia, CardContent, CardActions,
  Typography, Chip, Button, TextField, MenuItem, Stack, Box, Skeleton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, setFilters, claimItem } from '../store/slices/lostFoundSlice';

const categories = ['','ID Card','Electronics','Books','Clothing','Accessories','Keys','Wallet','Documents','Other'];
const types = ['', 'lost', 'found'];
const statuses = ['open','claimed','returned','resolved'];

export default function LostFoundList() {
  const dispatch = useDispatch();
  const { items, isLoading, filters, total, page, pages } = useSelector(s => s.lostfound);

  useEffect(() => {
    dispatch(fetchItems(filters));
  }, [dispatch, filters.page, filters.type, filters.category, filters.status, filters.q]);

  const handleChange = (name, value) => {
    dispatch(setFilters({ [name]: value, page: 1 }));
  };

  const handlePage = (delta) => {
    const next = Math.min(Math.max(1, page + delta), pages || 1);
    dispatch(setFilters({ page: next }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <TextField label="Search" value={filters.q} onChange={(e) => handleChange('q', e.target.value)} fullWidth />
        <TextField select label="Type" value={filters.type} onChange={(e) => handleChange('type', e.target.value)} sx={{ minWidth: 140 }}>
          {types.map(t => <MenuItem key={t || 'all'} value={t}>{t || 'All'}</MenuItem>)}
        </TextField>
        <TextField select label="Category" value={filters.category} onChange={(e) => handleChange('category', e.target.value)} sx={{ minWidth: 180 }}>
          {categories.map(c => <MenuItem key={c || 'all'} value={c}>{c || 'All'}</MenuItem>)}
        </TextField>
        <TextField select label="Status" value={filters.status} onChange={(e) => handleChange('status', e.target.value)} sx={{ minWidth: 160 }}>
          {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
        </TextField>
      </Stack>

      <Typography variant="body2" sx={{ mb: 2 }}>
        {total} results • Page {page} of {pages || 1}
      </Typography>

      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={220} />
              </Grid>
            ))
          : items.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item._id}>
                <Card>
                  {item.images?.[0]?.url ? (
                    <CardMedia 
  component="img" 
  height="140" 
  image={`http://localhost:5000${item.images[0].url}`} 
  alt={item.title} 
/>
                  ) : (
                    <Box sx={{ height: 140, bgcolor: 'grey.100' }} />
                  )}
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap">
                      <Chip size="small" label={item.type.toUpperCase()} color={item.type === 'lost' ? 'error' : 'success'} />
                      <Chip size="small" label={item.category} />
                      <Chip size="small" label={item.status} color="info" />
                    </Stack>
                    <Typography variant="h6" noWrap title={item.title}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap title={item.location}>
                      {item.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.date).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {item.status === 'open' && item.type === 'lost' && (
                      <Button size="small" onClick={() => dispatch(claimItem(item._id))}>
                        I Found It
                      </Button>
                    )}
                    {item.status === 'open' && item.type === 'found' && (
                      <Button size="small" onClick={() => dispatch(claimItem(item._id))}>
                        It's Mine
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))
        }
      </Grid>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
        <Button variant="outlined" disabled={page <= 1} onClick={() => handlePage(-1)}>Prev</Button>
        <Button variant="outlined" disabled={page >= pages} onClick={() => handlePage(1)}>Next</Button>
      </Stack>
    </Container>
  );
}
