// backend/src/model/AttendanceModel.js

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Sửa 'student' thành 'Student' (viết hoa S)
        required: true
    },
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class', // Sửa 'class' thành 'Class' (viết hoa C)
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true
    },
}, {
    timestamps: {
        createdAt: 'create_at',
        updatedAt: 'update_at'
    }
});

module.exports = mongoose.model('Attendance', attendanceSchema);