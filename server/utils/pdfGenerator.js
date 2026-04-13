const puppeteer = require('puppeteer');

/**
 * Generates an offer letter PDF with signature
 * @param {Object} offer - The offer letter object from DB
 */
exports.generateOfferPDF = async (offer) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 50px; }
        .company-name { font-size: 24px; font-weight: bold; color: #2563eb; }
        .details { margin-bottom: 30px; }
        .details p { margin: 5px 0; }
        .content { line-height: 1.6; }
        .signature-section { margin-top: 60px; display: flex; justify-content: space-between; }
        .sig-box { border-top: 1px solid #ccc; width: 250px; text-align: center; padding-top: 10px; }
        .sig-image { max-width: 200px; max-height: 100px; display: block; margin: 0 auto 10px; }
        .footer { margin-top: 100px; font-size: 10px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">${offer.companyName}</div>
        <div>Employment Offer Letter</div>
      </div>

      <div class="details">
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Candidate Name:</strong> ${offer.candidateName}</p>
        <p><strong>Job Title:</strong> ${offer.jobTitle}</p>
      </div>

      <div class="content">
        <p>Dear ${offer.candidateName},</p>
        <p>We are pleased to offer you the position of <strong>${offer.jobTitle}</strong> at ${offer.companyName}. We were impressed with your background and believe you will be a great addition to our team.</p>
        
        <p><strong>Salary:</strong> $${offer.salary.toLocaleString()} per annum</p>
        <p><strong>Joining Date:</strong> ${new Date(offer.joiningDate).toLocaleDateString()}</p>

        <p>Please review and sign this document to indicate your acceptance of this offer.</p>
      </div>

      <div class="signature-section">
        <div class="sig-box">
          <p>HR Manager</p>
          <div style="height: 100px; border-bottom: 1px dashed #ccc; margin-bottom: 10px;"></div>
          <p>(Authorized Signatory)</p>
        </div>
        
        <div class="sig-box">
          <p>Candidate Acceptance</p>
          ${offer.signature ? `<img src="${offer.signature}" class="sig-image" />` : '<div style="height: 100px; border-bottom: 1px dashed #ccc; margin-bottom: 10px;"></div>'}
          <p>${offer.candidateName}</p>
          ${offer.signedAt ? `<p style="font-size: 8px;">Signed on: ${new Date(offer.signedAt).toLocaleString()}<br/>IP: ${offer.ipAddress}</p>` : ''}
        </div>
      </div>

      <div class="footer">
        This document is electronically generated and holds legal standing when signed by both parties.
      </div>
    </body>
    </html>
  `;

  await page.setContent(content);
  const pdfBuffer = await page.pdf({ format: 'A4' });

  await browser.close();
  return pdfBuffer;
};
