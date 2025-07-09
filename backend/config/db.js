// config/db.js

const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Project_SWD';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
     console.log(`Đang kết nối tới MongoDB tại: ${MONGO_URI}`);
    console.log('✅ Kết nối tới MongoDB thành công!');
  } catch (err) {
    console.error('❌ Không thể kết nối tới MongoDB:', err.message);
    
    process.exit(1);
  }
};

module.exports = connectDB;