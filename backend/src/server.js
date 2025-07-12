const express=require('express');
const connectDB=require('./config/db');
const cors = require('cors');
const accountRoutes = require('./routes/AccountRoutes');
const app=express();
connectDB();
app.use(cors());
app.use(express.json()); 

app.use('/api/auth', accountRoutes);


const PORT=process.env.PORT||9999
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

