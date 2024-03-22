import { response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Coupon from '../models/couponModel.js'
import axios from 'axios';

import SSLCommerzPayment from 'sslcommerz-lts';

const sslcz = new SSLCommerzPayment(
    'cyphe65ce8f1d5862a',
    'cyphe65ce8f1d5862a@ssl',
    false 
  );

  
// @desc Create new order
// @route POST /api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        couponCode
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order Items');
    } 
    let discount = 10;
    if (couponCode) {
        try {
          
          const coupon = await validateCoupon(couponCode, totalPrice);
          discount = calculateDiscount(coupon, totalPrice);
        } catch (error) {
          res.status(400);
          throw new Error(error.message);
        }
      }

      const discountedTotalPrice = totalPrice - discount;
    
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice: discountedTotalPrice, 
            discount, 
            coupon: couponCode 
        });
        console.log(order);
        const createOrder = await order.save();
        res.status(201).json(createOrder);
    
});

// @desc Create new order
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id});
    res.status(200).json(orders);
});

// @desc Get Order by Id
// @route GET /api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'email').populate('orderItems.product');;
    console.log(order.user.email)
    if(order) {
        res.status(200).json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc uzzzz
// @route GET /api/orders/:id
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const { id: orderId } = req.params;
    const {  status } = req.body;
    console.log(status,orderId)

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (status === 'success') {
            // payment data
            const tran_id = order._id.toString();
            const data = {
                total_amount: order.totalPrice,
                currency: 'BDT',
                tran_id: tran_id,
                success_url: `${process.env.SERVER_URL}/api/orders/payment/success?orderId=${orderId}`, 
                fail_url: `${process.env.SERVER_URL}/api/orders/payment/failure?orderId=${orderId}`, 
                cancel_url: `${process.env.SERVER_URL}/api/orders/payment/cancel?orderId=${orderId}`, 
                shipping_method: 'Courier',
                product_name: order.orderItems.map(item => item.name).join(', '),
                product_category: 'Electronis', 
                product_profile: 'general',
                cus_email: req.user.email, 
                cus_phone: '01953363167', 
                ship_name: order.shippingAddress.address,
                ship_add1: order.shippingAddress.address,
                ship_add2: order.shippingAddress.address,
                ship_city: order.shippingAddress.city,
                ship_state: '',
                ship_postcode: order.shippingAddress.postalCode,
                ship_country: order.shippingAddress.country,
            };

           
            const apiResponse = await sslcz.init(data);
            if (!apiResponse || !apiResponse.GatewayPageURL) {
                throw new Error('Failed to initiate payment with SSLCommerz');
            }
            const GatewayPageURL = apiResponse.GatewayPageURL;

            res.send({ url: GatewayPageURL });
            console.log('Redirecting to:', GatewayPageURL);
            return;
        } else if (status === 'failure') {
            order.isPaid = false;
            order.paidAt = undefined;
        } else {
            return res.status(400).json({ message: 'Invalid status' });
        }

        order.isPaid = true;
        order.paidAt = new Date();
        await order.save();
        res.status(200).json({ message: 'Order status updated successfully' }); 

    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Failed to update order status' });
    }
});

export const handlePaymentSuccess = async (req, res) => {
    try {
      const { transactionId } = req.query;
  
     
      await verifyPayment(transactionId); 
      const updatedOrder = await Order.findByIdAndUpdate(transactionId, { isPaid: true });
  
      res.redirect(`${process.env.CLIENT_URL}/payment/success/${transactionId}`);
    } catch (error) {
      console.error('Error handling payment success:', error);
      res.status(500).json({ message: 'Failed to handle payment success' });
    }
  };


  
  export const handlePaymentFailure = async (req, res) => {
    try {
      const { transactionId } = req.query;
      console.error('Payment failed for transaction:', transactionId);
      res.redirect(`${process.env.CLIENT_URL}/payment/failure`);
    } catch (error) {
      console.error('Error handling payment failure:', error);
      res.status(500).json({ message: 'Failed to handle payment failure' });
    }
  };
  
// @desc update order to Delivered
// @route GET /api/orders/:id/pay
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isDelivered= true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.status(200).json(orders);
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
};
