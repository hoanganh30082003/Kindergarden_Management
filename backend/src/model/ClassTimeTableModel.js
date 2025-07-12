const mongoose = require('mongoose');

const classTimetableSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  weekday: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  start_time: {
    type: Time, // stored as "HH:mm"
    required: true
  },
  end_time: {
    type: Time, // stored as "HH:mm"
    required: true
  },
  activity: {
    type: String,
    required: true,
    maxlength: 100
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
  timestamps: true
});

module.exports = mongoose.model('ClassTimetable', classTimetableSchema);
