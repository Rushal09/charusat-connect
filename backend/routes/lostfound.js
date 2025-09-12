const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const LostItem = require('../models/lostitem');

const router = express.Router();

// Create uploads directory
const IMAGES_DIR = path.join(__dirname, '..', 'uploads', 'lostfound');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, IMAGES_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.user?.id || 'user'}_${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|webp|gif/.test(file.mimetype.toLowerCase());
    ok ? cb(null, true) : cb(new Error('Only image files allowed'));
  }
});

// POST /api/lostfound - Create new item
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const { type, title, description, category, location, date, name, email, phone } = req.body;
    
    console.log('Received data:', { type, title, category, location, date, name, email });
    
    if (!type || !title || !category || !location || !date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const images = (req.files || []).map(f => ({
      url: `/uploads/lostfound/${f.filename}`,
      filename: f.filename,
      uploadedAt: new Date()
    }));

    const item = await LostItem.create({
      type,
      title: title.trim(),
      description: (description || '').trim(),
      category,
      location: location.trim(),
      date: new Date(date),
      images,
      status: 'open',
      owner: req.user.id,
      contact: {
        name: name || req.user.username || 'Student',
        email: email || req.user.email,
        phone: phone || ''
      }
    });

    console.log('✅ Created item:', item._id);
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    console.error('❌ Create item error:', error);
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
});

// GET /api/lostfound - List items
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const items = await LostItem.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await LostItem.countDocuments({});
    
    console.log(`📋 Fetched ${items.length} items`);
    res.json({ 
      success: true, 
      data: items, 
      total, 
      page: Number(page), 
      pages: Math.ceil(total / Number(limit)) 
    });
  } catch (error) {
    console.error('❌ Fetch items error:', error);
    res.status(500).json({ message: 'Failed to fetch items' });
  }
});

module.exports = router;
