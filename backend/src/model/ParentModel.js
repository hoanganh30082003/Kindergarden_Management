// models/Parent.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ParentSchema = new Schema({
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
    maxlength: 50,
    required: false
  },
  phone: {
    type: String,
    maxlength: 10,
    required: false
  },
  email: {
    type: String,
    maxlength: 50,
    lowercase: true,
    trim: true
  },
  occupation: {
    type: String,
    maxlength: 50,
    required: false
  },
  relationship: {
    type: String,
    maxlength: 50,
    required: false
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Parent', ParentSchema);
