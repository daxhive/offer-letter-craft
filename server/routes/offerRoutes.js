const express = require('express');
const { 
  createOffer,
  getOffers,
  getOfferByLink, 
  updateStatus, 
  signOffer,
  downloadPDF
} = require('../controllers/offerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// HR/Admin routes
router.route('/')
  .post(protect, authorize('HR', 'ADMIN'), createOffer)
  .get(protect, authorize('HR', 'ADMIN'), getOffers);

router.route('/:id/status')
  .put(protect, authorize('HR', 'ADMIN'), updateStatus);

// Public/Candidate routes
router.get('/portal/:link', getOfferByLink);
router.post('/portal/:link/sign', signOffer);
router.get('/:id/download', downloadPDF);

module.exports = router;
