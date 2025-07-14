const express=require('express');
const connectDB=require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/AuthRoutes');
const paymentRoutes = require('./routes/PaymentRoutes');
const reportRoutes = require('./routes/ReportRoutes');
const app=express();
connectDB();
app.use(cors());
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

const PORT=process.env.PORT||9999
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

