const express=require('express');
const connectDB=require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/AuthRoutes');
const app=express();
connectDB();
app.use(cors());
app.use(express.json()); 

app.use('/api/auth', authRoutes);


const PORT=process.env.PORT||9999
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

