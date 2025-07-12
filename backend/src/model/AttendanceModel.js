const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  date: {
    type: DateTime,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
