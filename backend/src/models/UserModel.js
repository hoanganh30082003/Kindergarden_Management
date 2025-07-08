// models/User.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Admin', 'Teacher', 'Parent', 'Accountant'], 
    required: true
  },
  system_name: {
    type: String,
    maxlength: 50,
    required: false
  },
  email: {
    type: String,
    maxlength: 50,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    maxlength: 10
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Suspended'], 
    default: 'Active'
  },
  last_login: {
    type: Date,
    default: null
  },

},
  {
    timestamps: true 
  });

module.exports = mongoose.model('Users', UserSchema);
