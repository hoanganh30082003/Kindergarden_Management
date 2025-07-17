const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  full_name: {
    type: String,
    maxlength: 50,
    required: true
  },
  date_of_birth: {
    type: Date,
    required: false
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: false
  },
  address: {
    type: String,
    maxlength: 100,
    required: false
  },
  health_info: {
    type: String,
    required: false
  },
  student_photo: {
    type: String, // Có thể là URL hoặc tên file ảnh được lưu
    required: false
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent',
    required: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);
