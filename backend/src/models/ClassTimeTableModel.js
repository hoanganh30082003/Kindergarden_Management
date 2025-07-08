const mongoose = require('mongoose');

const classTimetableSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  weekday: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  start_time: {
    type: String, // stored as "HH:mm"
    required: true
  },
  end_time: {
    type: String, // stored as "HH:mm"
    required: true
  },
  activity: {
    type: String,
    required: true,
    maxlength: 50
  },
  is_special: {
    type: Boolean,
    default: false
  },
  note: {
    type: String,
    default: ''
  }
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
});

module.exports = mongoose.model('ClassTimetable', classTimetableSchema);
