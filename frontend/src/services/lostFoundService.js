// src/services/lostFoundService.js
import api from './api';

// Create Lost/Found item (multipart form-data)
const createItem = async (formData, onUploadProgress) => {
  const res = await api.post('/api/lostfound', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });
  return res.data.data;
};

// List items with filters
const listItems = async (params = {}) => {
  const res = await api.get('/api/lostfound', { params });
  return res.data;
};

// Get my items
const getMyItems = async () => {
  const res = await api.get('/api/lostfound/mine');
  return res.data.data;
};

// Update status
const updateStatus = async (id, status) => {
  const res = await api.patch(`/api/lostfound/${id}/status`, { status });
  return res.data.data;
};

// Claim item
const claimItem = async (id) => {
  const res = await api.post(`/api/lostfound/${id}/claim`);
  return res.data.data;
};

export default {
  createItem,
  listItems,
  getMyItems,
  updateStatus,
  claimItem,
};
