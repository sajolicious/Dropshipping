import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetCouponDetailsQuery, useUpdateCouponMutation } from '../../slices/couponApiSlice';

const UpdateCouponScreen = () => {
  const { id: couponId } = useParams();

  const [formData, setFormData] = useState({
    discount_type: '',
    discount_value: '',
    minimum_order_amount: '',
    start_date: '',
    end_date: '',
    usage_limit: ''
  });
  const { data: coupon, isLoading, error } = useGetCouponDetailsQuery(couponId);
  const [updateCoupon, { isLoading: loadingUpdate }] = useUpdateCouponMutation();

  useEffect(() => {
    if (coupon) {
      setFormData({
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        minimum_order_amount: coupon.minimum_order_amount,
        start_date: coupon.start_date,
        end_date: coupon.end_date,
        usage_limit: coupon.usage_limit
      });
    }
  }, [coupon]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCoupon({ couponId, ...formData }).unwrap();
      console.log(couponId)
      toast.success('Coupon updated');
      navigate('/admin/allcoupons');
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <>
      <Link to='/admin/allcoupons' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Coupon</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error.data.message}</Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='discountType'>
              <Form.Label>Discount Type</Form.Label>
              <Form.Control
                as='select'
                name='discount_type'
                value={formData.discount_type}
                onChange={handleChange}
              >
                <option value='percentage'>Percentage</option>
                <option value='fixed_amount'>Fixed Amount</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='discountValue'>
              <Form.Label>Discount Value</Form.Label>
              <Form.Control
                type='text'
                name='discount_value'
                value={formData.discount_value}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId='minimumOrderAmount'>
              <Form.Label>Minimum Order Amount</Form.Label>
              <Form.Control
                type='text'
                name='minimum_order_amount'
                value={formData.minimum_order_amount}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId='startDate'>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type='date'
                name='start_date'
                value={formData.start_date}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId='endDate'>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type='date'
                name='end_date'
                value={formData.end_date}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId='usageLimit'>
              <Form.Label>Usage Limit</Form.Label>
              <Form.Control
                type='text'
                name='usage_limit'
                value={formData.usage_limit}
                onChange={handleChange}
              />
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default UpdateCouponScreen;
