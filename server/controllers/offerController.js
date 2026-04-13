const OfferLetter = require('../models/OfferLetter');
const Notification = require('../models/Notification');
const crypto = require('crypto');
const { generateOfferPDF } = require('../utils/pdfGenerator');

// @desc    Create a new offer letter
// @route   POST /api/offers
// @access  Private/HR/Admin
exports.createOffer = async (req, res) => {
  const { candidateName, candidateEmail, jobTitle, salary, joiningDate } = req.body;

  try {
    const accessLink = crypto.randomBytes(20).toString('hex');

    const offer = await OfferLetter.create({
      candidateName,
      candidateEmail,
      jobTitle,
      salary,
      joiningDate,
      createdBy: req.user._id,
      accessLink,
      history: [{
        action: 'CREATED',
        user: req.user._id,
        details: 'Offer letter draft created.'
      }]
    });

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all offer letters
// @route   GET /api/offers
// @access  Private/HR/Admin
exports.getOffers = async (req, res) => {
  try {
    const offers = await OfferLetter.find({}).populate('createdBy', 'name email').sort('-createdAt');
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get offer by access link (Public/Candidate)
// @route   GET /api/offers/portal/:link
// @access  Public
exports.getOfferByLink = async (req, res) => {
  try {
    const offer = await OfferLetter.findOne({ accessLink: req.params.link });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found or link expired.' });
    }

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update offer status / Send offer
// @route   PUT /api/offers/:id/status
// @access  Private/HR/Admin
exports.updateStatus = async (req, res) => {
  const { status, details } = req.body;

  try {
    const offer = await OfferLetter.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    offer.status = status;
    offer.history.push({
      action: status,
      user: req.user._id,
      details: details || `Status updated to ${status}`
    });

    await offer.save();

    // Create notification if sent
    if (status === 'SENT') {
      // In a real app, send email here
      await Notification.create({
        recipient: req.user._id, // Notify HR that it was sent successfully
        message: `Offer for ${offer.candidateName} has been sent.`,
        type: 'OFFER_SENT',
        offerId: offer._id
      });
    }

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sign offer letter
// @route   POST /api/offers/portal/:link/sign
// @access  Public
exports.signOffer = async (req, res) => {
  const { signature } = req.body;

  try {
    const offer = await OfferLetter.findOne({ accessLink: req.params.link });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (offer.status === 'SIGNED') {
      return res.status(400).json({ message: 'Document already signed.' });
    }

    offer.signature = signature;
    offer.status = 'SIGNED';
    offer.signedAt = Date.now();
    offer.ipAddress = req.ip || req.headers['x-forwarded-for'];
    offer.history.push({
      action: 'SIGNED',
      details: 'Offer digitally signed by candidate.'
    });

    await offer.save();

    // Notify HR
    await Notification.create({
      recipient: offer.createdBy,
      message: `Candidate ${offer.candidateName} has signed the offer letter!`,
      type: 'OFFER_SIGNED',
      offerId: offer._id
    });

    res.json({ message: 'Signed successfully', offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download offer letter PDF
// @route   GET /api/offers/:id/download
// @access  Public (or Private depending on requirements, here Public for portal access)
exports.downloadPDF = async (req, res) => {
  try {
    const offer = await OfferLetter.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const pdfBuffer = await generateOfferPDF(offer);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=OfferLetter_${offer.candidateName.replace(/\s+/g, '_')}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};
