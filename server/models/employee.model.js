const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: [true, 'Please add a department']
  },
  position: {
    type: String,
    required: [true, 'Please add a position']
  },
  joiningDate: {
    type: Date,
    default: Date.now
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', EmployeeSchema);