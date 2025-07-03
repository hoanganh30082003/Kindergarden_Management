// models/User.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10,
    trim: true
  },
  password: {
    type: String,
    required: true,
    maxlength: 10
  },
  role: {
    type: String,
    enum: ['Admin', 'Teacher', 'Parent', 'Accountant'], // hoặc các vai trò khác mà bạn định nghĩa
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
    enum: ['Active', 'Inactive', 'Suspended'], // hoặc trạng thái bạn định nghĩa
    default: 'Active'
  },
  last_login: {
    type: Date,
    default: null
  },

},
  {
    timestamps: true // tự động tạo createdAt và updatedAt
  });

module.exports = mongoose.model('User', UserSchema);
