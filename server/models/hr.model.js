const mongoose = require('mongoose');

const HRSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    default: 'Human Resources'
  },
  position: {
    type: String,
    required: [true, 'Please add a position']
  },
  phoneNumber: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HR', HRSchema);