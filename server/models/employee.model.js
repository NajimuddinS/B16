const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  profileImage: {
    public_id: {
      type: String,
      default: 'default_profile'
    },
    url: {
      type: String,
      default: 'https://res.cloudinary.com/your-cloudname/image/upload/v1/default_profile.png'
    }
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  salary: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Employee', EmployeeSchema);