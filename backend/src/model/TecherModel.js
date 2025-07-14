const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  qualification: {
    type: String,
    maxlength: 50,
    required: true,
  },
  experience_years: {
    type: Number,
    required: true,
    min: 0,
  },
  hired_date: {
    type: Date,
    required: true,
  },
  note: {
    type: String, // TEXT tương đương với String (không giới hạn độ dài)
    default: '',
  },
}, {
  timestamps: true // tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('Teacher', teacherSchema);
