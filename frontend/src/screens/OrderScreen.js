import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import { useGetOrderDetailsQuery, usePayOrderMutation, useDeliverOrderMutation } from '../slices/ordersApiSlice';
import {  useDispatch } from 'react-redux';

import { clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
const OrderScreen = () => {
    const { id: orderId } = useParams();
    const dispatch = useDispatch();
   
    const [creatingOrder, setCreatingOrder] = useState(false);

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const { userInfo } = useSelector((state)=>state.auth);
    const [deliverOrder, {isLoading: loadingDeliver}] = useDeliverOrderMutation();

    const payOrderHandler = async () => {
      try {
          setCreatingOrder(true);
          const paymentDetails = {};
          const paymentResult = await payOrder(orderId, paymentDetails).unwrap();
          dispatch(clearCartItems());
          // Optionally, you can redirect the user to a success page after payment
          // Handle the payment result here
          console.log('Payment successful:', paymentResult);
          // Redirect the user to the SSLCommerz payment page
          window.location.href = 'https://sandbox.sslcommerz.com/EasyCheckOut/testcdea679ada857f3f00ff54b1c20a29c4039';
      } catch (error) {
          console.error('Error paying for order:', error);
          // Handle error
      } finally {
          setCreatingOrder(false);
      }
  };
  

    const deliverOrderHandler = async () => {
      try{
         await deliverOrder(orderId);
         refetch();
         toast.success('order delivered')
      } catch (err){
        toast.error(err?.data?.message || err.message)

      }
    }
    return isLoading ? <Loader/> : error ? <Message variant='danger'/> 
    : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col> $ {order.itemsPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col> $ {order.shippingPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col> $ {order.taxPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Total</Col>
                                    <Col> $ {order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                            <ListGroup.Item>
                                <Button
                                    type="button"
                                    className="btn-block"
                                    disabled={creatingOrder}
                                    onClick={payOrderHandler}
                                >
                                    {creatingOrder ? <Loader /> : 'Pay Now'}
                                </Button>
                            </ListGroup.Item>
                        )}
                        {/* Mark as delivered button (for admin) */}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button
                                    type='button'
                                    className='btn btn-block'
                                    onClick={deliverOrderHandler}
                                >
                                    Mark as Delivered
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                    </Card>
                   
                </Col>
            </Row>
        </>
    );
};

export default OrderScreen;
