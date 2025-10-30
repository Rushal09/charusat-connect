import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import {
  PersonOutlined,
  MessageOutlined,
  VerifiedUserOutlined,
  CloseOutlined
} from '@mui/icons-material';
import api from '../../services/api';

const ClaimModal = ({ open, onClose, item, onClaimSuccess }) => {
  const [formData, setFormData] = useState({
    message: '',
    proofDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!formData.proofDescription.trim()) {
      setError('Please provide proof that this item belongs to you.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(`/lostfound/${item._id}/claim`, formData);
      onClaimSuccess(response.data.message);
      onClose();
      setFormData({ message: '', proofDescription: '' });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit claim');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setFormData({ message: '', proofDescription: '' });
      setError('');
    }
  };

  if (!item) return null;

  return (
    <>
      {/* Custom CSS for this modal */}
      <style jsx>{`
        .claim-modal-header {
          background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
          color: white;
          padding: 24px;
          position: relative;
        }
        
        .claim-modal-content {
          padding: 32px 24px;
        }
        
        .item-preview-card {
          background: linear-gradient(135deg, #f8f9ff 0%, #e3f2fd 100%);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e3f2fd;
          margin-bottom: 24px;
        }
        
        .proof-section {
          background: #fff3e0;
          border-radius: 12px;
          padding: 20px;
          border-left: 4px solid #ff9800;
          margin: 16px 0;
        }
        
        .submit-button {
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: white;
          border-radius: 12px;
          padding: 12px 32px;
          font-weight: 700;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
        }
        
        .cancel-button {
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 600;
        }
      `}</style>

      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            minHeight: '500px'
          }
        }}
      >
        {/* Header */}
        <Box className="claim-modal-header">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={2}>
              <VerifiedUserOutlined sx={{ fontSize: 32 }} />
              <Box>
                <Typography variant="h5" fontWeight="800">
                  Claim This Item
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {item.type === 'lost' ? 'I found this item' : 'This is my item'}
                </Typography>
              </Box>
            </Box>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{ 
                color: 'white',
                minWidth: 'auto',
                p: 1,
                borderRadius: 2
              }}
            >
              <CloseOutlined />
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <DialogContent className="claim-modal-content">
          {/* Item Preview */}
          <Box className="item-preview-card">
            <Box display="flex" gap={3}>
              {item.images?.[0] && (
                <Box
                  component="img"
                  src={`http://localhost:5000${item.images[0].url}`}
                  alt={item.title}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    objectFit: 'cover'
                  }}
                />
              )}
              <Box flex={1}>
                <Typography variant="h6" fontWeight="700" color="#1976d2">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {item.category} • {item.location}
                </Typography>
                <Chip
                  label={item.type.toUpperCase()}
                  size="small"
                  color={item.type === 'lost' ? 'error' : 'success'}
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Proof Section */}
          <Box className="proof-section">
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <VerifiedUserOutlined color="warning" />
              <Typography variant="h6" fontWeight="700">
                Verification Required
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={item.type === 'lost' ? 'Describe where/how you found it' : 'Prove this item is yours'}
              placeholder={
                item.type === 'lost' 
                  ? 'e.g., "I found this in the library on the second floor near the computer section. It was under table number 5."'
                  : 'e.g., "This is my phone. The lock screen has my photo and my name is saved as owner contact."'
              }
              value={formData.proofDescription}
              onChange={(e) => setFormData(prev => ({ ...prev, proofDescription: e.target.value }))}
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'white'
                }
              }}
            />
          </Box>

          {/* Optional Message */}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Additional Message (Optional)"
            placeholder="Any additional information for the owner..."
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            variant="outlined"
            sx={{
              mt: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2
              }
            }}
          />

          {/* Contact Info Note */}
          <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>Privacy Note:</strong> Your contact details will only be shared with the item owner if they approve your claim.
            </Typography>
          </Alert>
        </DialogContent>

        {/* Actions */}
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            className="cancel-button"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !formData.proofDescription.trim()}
            className="submit-button"
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <MessageOutlined />}
          >
            {loading ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClaimModal;
