const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['passenger', 'admin'],
    default: 'passenger'
  },
  penumpang_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Penumpang'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;