const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/offer_letter_craft';
    
    console.log('⏳ Connecting to MongoDB...');
    
    const conn = await mongoose.connect(MONGODB_URI, {
      // These options are now default in Mongoose 6+, but good to keep for clarity if using older versions
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
