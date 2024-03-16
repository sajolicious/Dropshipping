import { response } from 'express';
import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Coupon from '../models/couponModel.js'
import axios from 'axios';
import SSLCommerzPayment from 'sslcommerz-lts';
const sslcz = new SSLCommerzPayment('cyphe65ce8f1d5862a', 'cyphe65ce8f1d5862a@ssl', false); // Replace with your actual store ID and password



  
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
    const order = await Order.findById(req.params.id);
   
    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    order.isPaid = true;
    const data = {
        total_amount: order.totalPrice,
        currency: 'BDT',
        tran_id: order._id.toString(), 
        success_url: `http://localhost:3000/success/{tran_id}`, 
        fail_url: 'http://localhost:3030/fail', 
        cancel_url: 'http://localhost:3030/cancel', 
        shipping_method: 'Courier',
        product_name:  order.orderItems.map(item => item.name).join(', '),
        product_category: 'Electronic',
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

    try {
        // Make API call to SSLCommerz to initiate payment
        const apiResponse = await sslcz.init(data);
        const GatewayPageURL = apiResponse.GatewayPageURL;
        
        // Redirect the user to the SSLCommerz payment gateway
        res.send({url: GatewayPageURL});
        console.log('Redirecting to:', GatewayPageURL);

        // Update order status to paid
       
        order.paidAt = Date.now();
        await order.save();
    } catch (error) {
        console.error('Error initiating payment with SSLCommerz:', error);
        res.status(500).json({ message: 'Failed to initiate payment' });
    }
});


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
