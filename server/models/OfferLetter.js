const mongoose = require('mongoose');

const offerLetterSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true,
    trim: true,
  },
  candidateEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    default: 'LuxeHR Corporation',
  },
  status: {
    type: String,
    enum: ['DRAFT', 'SENT', 'SIGNED', 'COMPLETED', 'REJECTED'],
    default: 'DRAFT',
  },
  accessLink: {
    type: String,
    unique: true,
  },
  signature: {
    type: String, // Base64 signature image
  },
  signedAt: {
    type: Date,
  },
  ipAddress: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  history: [
    {
      action: String,
      timestamp: { type: Date, default: Date.now },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      details: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

offerLetterSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const OfferLetter = mongoose.model('OfferLetter', offerLetterSchema);
module.exports = OfferLetter;
