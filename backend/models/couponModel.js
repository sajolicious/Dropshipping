import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String, 
    required: true,
    unique: true,
  },
  discount_type: {
    type: String,
    enum: ['percentage', 'fixed_amount'],
    required: true,
  },
  discount_value: {
    type: Number,
    required: true,
  },
  minimum_order_amount: {
    type: Number,
    default: 0,
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
  usage_limit: {
    type: Number,
    default: null,
  },
  used_count: {
    type: Number,
    default: 0,
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
