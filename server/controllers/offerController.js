const OfferLetter = require('../models/OfferLetter');
const Notification = require('../models/Notification');
const crypto = require('crypto');
const { generateOfferPDF } = require('../utils/pdfGenerator');

// ✅ CREATE OFFER
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
      createdBy: req.user?._id || null,
      accessLink,
      history: [{
        action: 'CREATED',
        user: req.user?._id || null,
        details: 'Offer letter draft created.'
      }]
    });

    res.status(201).json(offer);
  } catch (error) {
    console.log("🔥 ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET ALL OFFERS
exports.getOffers = async (req, res) => {
  try {
    const offers = await OfferLetter.find({})
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅🔥 NEW: GET SINGLE OFFER (VERY IMPORTANT)
exports.getOfferById = async (req, res) => {
  try {
    const offer = await OfferLetter.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET BY ACCESS LINK
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

// ✅ UPDATE STATUS
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
      user: req.user?._id || null,
      details: details || `Status updated to ${status}`
    });

    await offer.save();

    // ✅ FIXED notification (comma issue fixed)
    if (status === 'SENT') {
      await Notification.create({
        recipient: req.user?._id || null,
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

// ✅ SIGN OFFER
exports.signOffer = async (req, res) => {
  const { signature } = req.body;

  try {
    const offer = await OfferLetter.findOne({ accessLink: req.params.link });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    if (offer.status === 'SIGNED') {
      return res.status(400).json({ message: 'Already signed' });
    }

    offer.signature = signature;
    offer.status = 'SIGNED';
    offer.signedAt = Date.now();
    offer.ipAddress = req.ip;

    offer.history.push({
      action: 'SIGNED',
      details: 'Offer signed by candidate'
    });

    await offer.save();

    await Notification.create({
      recipient: offer.createdBy,
      message: `Candidate ${offer.candidateName} signed the offer`,
      type: 'OFFER_SIGNED',
      offerId: offer._id
    });

    res.json({ message: 'Signed successfully', offer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DOWNLOAD PDF
exports.downloadOffer = async (req, res) => {
  try {
    const offer = await OfferLetter.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    const pdfBuffer = await generateOfferPDF(offer);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Offer_${offer.candidateName}.pdf`
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'PDF error' });
  }
};
// ✅ DELETE OFFER
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await OfferLetter.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    await offer.deleteOne();

    res.json({ message: 'Offer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
