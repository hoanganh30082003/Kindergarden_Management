const mongoose = require('mongoose');

const tuitionFeeSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  monthly_fee: {
    type: mongoose.Types.Decimal128,
    required: true
  },
  effective_date: {
    type: Date,
    required: true
  },
  note: {
    type: String,
    default: ''
  },
  last_editor: {
    type: mongoose.type.Schema.ObjectId,
    ref: 'Account',
    require: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TuitionFee', tuitionFeeSchema);
