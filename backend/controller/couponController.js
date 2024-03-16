import shortid from 'shortid' 
import Coupon from '../models/couponModel.js'
import asyncHandler from '../middleware/asyncHandler.js'


// @desc    Validate coupon code during checkout
// @route   GET /api/pcoupon/
// @access  Private Admin
export const validateCoupon = asyncHandler(async (req, res) => {
  const { couponCode, totalPrice } = req.query;
  
  
  console.log(couponCode,totalPrice)
  try {
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon || !coupon.active) {
      throw new Error('Invalid coupon code');
    }
    const currentDate = new Date();
    if (coupon.start_date && currentDate < coupon.start_date) {
      throw new Error('Coupon is not yet valid');
    }

    if (coupon.end_date && currentDate > coupon.end_date) {
      throw new Error('Coupon has expired');
    }
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      throw new Error('Coupon usage limit exceeded');
    }
    const discountAmount = calculateDiscount(coupon, totalPrice);
    console.log(totalPrice)
    res.json({ valid: true, discountAmount });
    console.log(discountAmount)
  } catch (error) {
    let errorMessage = 'Coupon validation failed.';
    switch (error.message) {
      case 'Invalid coupon code':
        errorMessage = 'The provided coupon code is invalid.';
        break;
      case 'Coupon is not yet valid':
        errorMessage = 'The coupon is not yet valid.';
        break;
      case 'Coupon has expired':
        errorMessage = 'The coupon has expired.';
        break;
      case 'Coupon usage limit exceeded':
        errorMessage = 'The coupon usage limit has been reached.';
        break;
      default:
  
        console.error('Unexpected error:', error);
    }
    res.status(400).json({ valid: false, message: errorMessage });
  }
});



export const calculateDiscount = (coupon, totalPrice) => {
  console.log("Coupon Discount Value:", coupon.discount_value);
  console.log("Total Price:", totalPrice);

  let discountAmount = 0;

  if (coupon.discount_type === 'percentage') {
    discountAmount = (coupon.discount_value * totalPrice) / 100;
  } else if (coupon.discount_type === 'fixed_amount') {
    discountAmount = Math.min(coupon.discount_value, totalPrice);
  }

 return discountAmount;
};
// @desc    Create new Coupon
// @route   POST /api/coupon/
// @access  Private Admin
export const createCoupon = asyncHandler(async (req, res) => {
  try {
    const {
      discount_type,
      discount_value,
      minimum_order_amount,
      start_date,
      end_date,
      usage_limit,
    } = req.body


    if (!discount_type || !discount_value) {
      return res
        .status(400)
        .json({ message: 'Discount type and value are required' })
    }
  

    const code = shortid.generate() 

    const newCoupon = new Coupon({
      code,
      discount_type,
      discount_value,
      minimum_order_amount,
      start_date: start_date && new Date(start_date), 
      end_date: end_date && new Date(end_date),
      usage_limit,
      active: true,
      used_count: 0,
    })

    const savedCoupon = await newCoupon.save()
    res.status(201).json(savedCoupon)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error creating coupon' })
  }
})

// @desc    Get All Coupon
// @route   GET /api/coupon/
// @access  Private Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find()
    res.json(coupons)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching coupons' })
  }
})


// @desc    Get a single coupon by ID
// @route   GET /api/coupon/:id
// @access  Private Admin
export const getCouponById = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }
    res.json(coupon)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error fetching coupon' })
  }
})

// @desc    Edit a coupon
// @route   GET /api/coupon/:id
// @access  Private Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  try {
    const {
      discount_type,
      discount_value,
      minimum_order_amount,
      start_date,
      end_date,
      usage_limit,
    } = req.body
    console.log('hey brow', req.params.id)
    const coupon = await Coupon.findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    coupon.discount_type = discount_type || coupon.discount_type
    coupon.discount_value = discount_value || coupon.discount_value
    coupon.minimum_order_amount =
      minimum_order_amount || coupon.minimum_order_amount
    coupon.start_date = start_date && new Date(start_date)
    coupon.end_date = end_date && new Date(end_date)
    coupon.usage_limit = usage_limit || coupon.usage_limit

    const updatedCoupon = await coupon.save()
    res.json(updatedCoupon)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error updating coupon' })
  }
})


// @desc    delete coupon by id
// @route   DELETE /api/coupon/:id
// @access  Private Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const couponId = req.params.id;
  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  await coupon.deleteOne();
  res.json({ message: 'Coupon removed' });
});


// @desc    deactive coupon
// @route   PUT /api/coupon/:id
// @access  Private Admin
export const deactivateCoupon = asyncHandler(async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }, 
    )

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    res.json({ message: 'Coupon deactivated successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error deactivating coupon' })
  }
})
