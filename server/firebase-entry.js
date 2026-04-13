const functions = require('firebase-functions/v2');
const { app, connectDB } = require('./index');

// Initialize MongoDB connection
connectDB();

// Export the Express app as a Firebase Cloud Function
// Using 2nd Gen functions for better performance and Cloud Run backing
exports.api = functions.https.onRequest({
  memory: '2GiB', // Generous memory for Puppeteer
  timeoutSeconds: 300,
  cpu: 1,
  cors: true,
}, app);
