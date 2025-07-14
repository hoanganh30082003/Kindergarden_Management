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
  }
}, {
  timestamps: {
    createdAt: 'create_at',
    updatedAt: 'update_at'
  }
});

module.exports = mongoose.model('TuitionFee', tuitionFeeSchema);
