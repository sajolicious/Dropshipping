import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Row, Col, ListGroup, Image, Card, Form } from 'react-bootstrap';
import CheckoutSteps from '../components/CheckoutSteps';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import { useValidateCouponMutation } from '../slices/couponApiSlice';
import { updateTotalPrice } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [validatedCoupon, setValidatedCoupon] = useState(null);
  const [updatedTotalPrice, setUpdatedTotalPrice] = useState(() => {
    const storedUpdatedTotalPrice = JSON.parse(localStorage.getItem('cart'))?.totalPrice;
    return storedUpdatedTotalPrice ? parseFloat(storedUpdatedTotalPrice) : cart.totalPrice;
  });

  const [createOrder, { isLoading: loadingCreateOrder }] = useCreateOrderMutation();
  const [validateCoupon] = useValidateCouponMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }

    const storedUpdatedTotalPrice = JSON.parse(localStorage.getItem('cart'))?.totalPrice;
    if (storedUpdatedTotalPrice) {
      setUpdatedTotalPrice(parseFloat(storedUpdatedTotalPrice));
    }
  }, [cart.shippingAddress.address, cart.paymentMethod, navigate]);

  const placeOrderHandler = async () => {
    try {
      setCreatingOrder(true);
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        coupon: validatedCoupon,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setCreatingOrder(false);
    }
  };

  const applyCouponHandler = async () => {
    try {
      const response = await validateCoupon({
        couponCode,
        totalPrice: cart.totalPrice,
      });
      if (response.data.valid) {
        setValidatedCoupon(response.data);
        const discountAmount = cart.totalPrice - response.data.discountAmount;

        const updatedCart = {
          ...cart,
          totalPrice: discountAmount,
        };

        dispatch(updateTotalPrice(discountAmount));

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setUpdatedTotalPrice(discountAmount); // Update the local state
      } else {
        toast.error(response.data.message || 'Failed to apply coupon');
      }
    } catch (error) {
      console.error('Coupon validation error:', error);
      toast.error(error?.data?.message || 'Failed to apply coupon');
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        {/* Shipping details and payment method */}
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Address:</strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method:</strong> {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your Cart is Empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} * TK{item.price} = Tk{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        {/* Order summary and discount coupon */}
        <Col md={4}>
          <Card>
            <ListGroup>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items: </Col>
                  <Col>Tk{cart.itemPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping: </Col>
                  <Col>Tk{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax: </Col>
                  <Col>Tk{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Display coupon input field */}
              {!validatedCoupon && (
                <ListGroup.Item>
                  <Form>
                    <Form.Group controlId="couponCode">
                      <Form.Label>Coupon Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                    </Form.Group>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={applyCouponHandler}
                    >
                      Apply Coupon
                    </Button>
                  </Form>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Row>
                  <Col>Total: </Col>
                  <Col>Tk{validatedCoupon ? updatedTotalPrice : cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0 || creatingOrder}
                  onClick={placeOrderHandler}
                >
                  {creatingOrder ? <Loader /> : 'Place Order'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
