const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  class_name: {
    type: String,
    required: true,
    maxlength: 10,
    unique: true 
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  }
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
});

module.exports = mongoose.model('Class', classSchema);
