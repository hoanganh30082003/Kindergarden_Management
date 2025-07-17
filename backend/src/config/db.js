const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI); 
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected");
    } catch (error) {
        console.log("MongoDB connection failed:", error);
        process.exit(1);
    }
};
module.exports = connectDB;

