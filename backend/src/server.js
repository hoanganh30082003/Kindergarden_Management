
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const accountRoutes = require('./routes/AccountRoutes');
const attendanceRoutes = require('./routes/AttendanceRoutes');
const timetableRoutes = require('./routes/ClassTimetableRoutes');
const paymentRoutes = require('./routes/PaymentRoutes')
const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', accountRoutes);
app.use('/api/payment',paymentRoutes)
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});