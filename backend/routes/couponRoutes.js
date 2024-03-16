import express from 'express';
const router = express.Router();
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  deactivateCoupon,
  validateCoupon
} from '../controller/couponController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route("/").get(getAllCoupons).post(protect,admin,createCoupon);

router.route("/:id").get(getCouponById).put(protect,admin,updateCoupon)
router.route("/:id").delete(protect,admin,deleteCoupon)
router.route("/validate").post(protect, validateCoupon);



export default router;