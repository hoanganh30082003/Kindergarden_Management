const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', 
    required: true
  },
  payment_date: {
    type: Date,
  },
  amount: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  payment_type: {
    type: String,
    enum: ['Tuition', 'Meal'],
    required: true
  },
  method: {
    type: String,
    enum: ['Online', 'Offline'],
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    required: true
  },
  note: {
    type: String
  }
}, {
  timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Payment', paymentSchema);
