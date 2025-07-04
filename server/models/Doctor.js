const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  education: [
    {
      degree: String,
      university: String,
      year: Number
    }
  ],
  experience: [
    {
      position: String,
      hospital: String,
      from: Date,
      to: Date,
      current: Boolean
    }
  ],
  availability: [
    {
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      startTime: String,
      endTime: String
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Doctor', DoctorSchema);