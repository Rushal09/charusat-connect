const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, maxlength: 1000, default: '' },
  category: { 
    type: String, 
    enum: ['ID Card','Electronics','Books','Clothing','Accessories','Keys','Wallet','Documents','Other'],
    required: true
  },
  location: { type: String, maxlength: 120, required: true },
  date: { type: Date, required: true },
  images: [{
    url: { type: String, required: true },
    filename: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['open','claimed','returned','resolved'], default: 'open' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contact: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' }
  }
}, { timestamps: true });

let LostItem;
try { LostItem = mongoose.model('LostItem'); }
catch { LostItem = mongoose.model('LostItem', lostItemSchema); }

module.exports = LostItem;
