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
  last_editor: {
  type: mongoose.type.Schema.ObjectId,
  ref: 'Account',
  required: true
  }
}, 
{
  timestamps: true
});

module.exports = mongoose.model('MealFee', mealFeeSchema);
