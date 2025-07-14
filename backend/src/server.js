const express=require('express');
const connectDB=require('./config/db');
const cors = require('cors');
const accountRoutes = require('./routes/AccountRoutes');
const paymentRoutes = require('./routes/PaymentRoutes')
const app=express();
connectDB();
app.use(cors());
app.use(express.json()); 

app.use('/api/auth', accountRoutes);
app.use('/api/payment',paymentRoutes)

const PORT=process.env.PORT||9999
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

