const express = require('express');
const {
  createOffer,
  getOffers,
  getOfferById,
  getOfferByLink,
  updateStatus,
  signOffer,
  downloadOffer,
  deleteOffer // ✅ ADD
} = require('../controllers/offerController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// ✅ HR/Admin routes
router.route('/')
  .post(protect, authorize('HR', 'ADMIN'), createOffer)
  .get(protect, authorize('HR', 'ADMIN'), getOffers);

// ✅ DELETE ROUTE
router.delete('/:id', protect, authorize('HR', 'ADMIN'), deleteOffer);

// ✅ Update status
router.route('/:id/status')
  .put(protect, authorize('HR', 'ADMIN'), updateStatus);

// ✅ Public routes
router.get('/portal/:link', getOfferByLink);
router.post('/portal/:link/sign', signOffer);

// ⚠️ ORDER IMPORTANT
router.get('/:id/download', downloadOffer);
router.get('/:id', getOfferById);

module.exports = router;
