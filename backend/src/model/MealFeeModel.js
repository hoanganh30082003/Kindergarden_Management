const mongoose = require('mongoose');

const mealFeeSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  effective_date: {
    type: Date,
    required: true
  },
  breakfast_fee: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  lunch_fee: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  snack_fee: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  payment_status: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Unpaid'
  }
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
});

module.exports = mongoose.model('MealFee', mealFeeSchema);