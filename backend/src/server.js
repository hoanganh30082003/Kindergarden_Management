const express=require('express');
const connectDB=require('../config/db');
const cors = require('cors');
const app=express();
connectDB();
app.use(cors());
app.use(express.json()); 


const PORT=process.env.PORT||9999
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

