// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 
const authRoutes = require('./src/routes/AuthRoutes');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 9999;

app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});