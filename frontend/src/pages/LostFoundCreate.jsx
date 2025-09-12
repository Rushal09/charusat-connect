import React, { useState } from 'react';
import {
  Container, Paper, Typography, Grid, TextField, MenuItem,
  Button, LinearProgress, Box, Alert, ToggleButtonGroup, ToggleButton
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createLostFound, setUploadProgress, resetCreateState } from '../store/slices/lostFoundSlice';

const categories = ['ID Card','Electronics','Books','Clothing','Accessories','Keys','Wallet','Documents','Other'];

export default function LostFoundCreate() {
  const dispatch = useDispatch();
  const { isCreating, uploadProgress, error } = useSelector(s => s.lostfound);

  const [form, setForm] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: '',
    location: '',
    date: new Date().toISOString().slice(0,10),
    contact: { name: '', email: '', phone: '' },
    images: []
  });

  const onChange = (e) => {
    const { name, value } = e.target;
    if (['name','email','phone'].includes(name)) {
      setForm(prev => ({ ...prev, contact: { ...prev.contact, [name]: value }}));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setForm(prev => ({ ...prev, images: files.slice(0,5) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('type', form.type);
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('category', form.category);
    fd.append('location', form.location);
    fd.append('date', form.date);
    fd.append('contact[name]', form.contact.name);
    fd.append('contact[email]', form.contact.email);
    fd.append('contact[phone]', form.contact.phone);
    form.images.forEach(f => fd.append('images', f));

    dispatch(resetCreateState());
    await dispatch(createLostFound({
      payload: fd,
      onUploadProgress: (evt) => {
        if (!evt.total) return;
        const p = Math.round((evt.loaded * 100) / evt.total);
        dispatch(setUploadProgress(p));
      }
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Create Lost & Found Post
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {isCreating && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="caption">{uploadProgress}%</Typography>
          </Box>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ToggleButtonGroup
                exclusive
                value={form.type}
                onChange={(_, v) => v && setForm(prev => ({ ...prev, type: v }))}
              >
                <ToggleButton value="lost">Lost</ToggleButton>
                <ToggleButton value="found">Found</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField fullWidth label="Title" name="title" value={form.title} onChange={onChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select fullWidth label="Category" name="category" value={form.category} onChange={onChange} required>
                {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Description" name="description" value={form.description} onChange={onChange} multiline rows={3} />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location" name="location" value={form.location} onChange={onChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Date" name="date" value={form.date} onChange={onChange} InputLabelProps={{ shrink: true }} required />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Contact Name" name="name" value={form.contact.name} onChange={onChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Contact Email" name="email" type="email" value={form.contact.email} onChange={onChange} required />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Phone (optional)" name="phone" value={form.contact.phone} onChange={onChange} />
            </Grid>

            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Select Images (max 5)
                <input hidden accept="image/*" multiple type="file" onChange={onFiles} />
              </Button>
              <Typography variant="caption" sx={{ ml: 1 }}>
                {form.images.length ? `${form.images.length} selected` : 'No files selected'}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={isCreating}>
                {isCreating ? 'Uploading...' : 'Post'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
