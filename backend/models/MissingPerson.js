const mongoose = require('mongoose');

const missingPersonSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  lastSeenLocation: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: {
      type: String,
      default: ''
    }
  },
  dateMissing: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  images: [{
    type: String
  }],
  faceEncoding: {
    type: [Number],
    default: []
  },
  status: {
    type: String,
    enum: ['Active', 'Found', 'Closed'],
    default: 'Active'
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

missingPersonSchema.index({ lastSeenLocation: '2dsphere' });

module.exports = mongoose.model('MissingPerson', missingPersonSchema);