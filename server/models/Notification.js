const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['OFFER_SENT', 'OFFER_SIGNED', 'OFFER_REJECTED', 'SYSTEM'],
    default: 'SYSTEM',
  },
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OfferLetter',
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
