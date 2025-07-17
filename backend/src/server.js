const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');

const attendanceRoutes = require('./routes/AttendanceRoutes');
const timetableRoutes = require('./routes/ClassTimetableRoutes');
const paymentRoutes = require('./routes/PaymentRoutes')
const parentRoutes = require('./routes/ParentRoutes')
const authRoutes = require('./routes/AuthRoutes');
const reportRoutes = require('./routes/ReportRoutes');
const classRoutes = require('./routes/ClassRoutes');
const mealFeeRoutes = require('./routes/MealFeeRoutes');
const tuitionFeeRoutes = require('./routes/TuitionFeeRoutes');
const studentRoutes = require('./routes/StudentRoutes');
const teacherRoutes = require('./routes/TeacherRoutes');

const app=express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use('/api/payment',paymentRoutes)
app.use('/api/attendance', attendanceRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/parent',parentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/class', classRoutes);
app.use('/api/meal-fee', mealFeeRoutes);
app.use('/api/tuition-fee', tuitionFeeRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);


const PORT=process.env.PORT||9999
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
