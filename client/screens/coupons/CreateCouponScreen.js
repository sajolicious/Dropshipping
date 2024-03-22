import React, { useReducer } from 'react';
import { useCreateCouponMutation } from '../../slices/couponApiSlice';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';


const useFormValidation = () => {
  const validate = (formData) => {
    if (!formData.discount_value || isNaN(formData.discount_value) || parseFloat(formData.discount_value) <= 0) {
      toast.error('Please enter a valid discount value.');
      return false;
    }
    if (!formData.minimum_order_amount || isNaN(formData.minimum_order_amount) || parseFloat(formData.minimum_order_amount) <= 0) {
      toast.error('Please enter a valid minimum order amount.');
      return false;
    }
    if (!formData.start_date || !formData.end_date) {
      toast.error('Please select start and end dates.');
      return false;
    }
    if (new Date(formData.start_date) >= new Date(formData.end_date)) {
      toast.error('End date must be after start date.');
      return false;
    }
    if (!formData.usage_limit || isNaN(formData.usage_limit) || parseInt(formData.usage_limit) < 0) {
      toast.error('Please enter a valid usage limit.');
      return false;
    }
    return true;
  };

  return validate;
};

const CreateCouponScreen = () => {
  const [formData, dispatchForm] = useReducer(
    (state, action) => ({ ...state, ...action }),
    {
      discount_type: 'percentage',
      discount_value: '',
      minimum_order_amount: '',
      start_date: '',
      end_date: '',
      usage_limit: '',
    }
  );

  const [createCoupon, { isLoading, isError, error }] = useCreateCouponMutation();
  const validateForm = useFormValidation();

  const handleChange = (e) => {
    dispatchForm({ [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) return;

    try {
      await createCoupon(formData).unwrap();
      toast.success('Coupon created successfully!', {
        position: toast.POSITION.TOP_CENTER,
      });
      dispatchForm({
        discount_type: 'percentage',
        discount_value: '',
        minimum_order_amount: '',
        start_date: '',
        end_date: '',
        usage_limit: '',
      });
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <Container >
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <h2>Create Coupon</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="discountType">
              <Form.Label>Discount Type</Form.Label>
              <Form.Control as="select" name="discount_type" value={formData.discount_type} onChange={handleChange}>
                <option value="percentage">Percentage</option>
                <option value="fixed_amount">Fixed Amount</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="discountValue">
              <Form.Label>Discount Value</Form.Label>
              <Form.Control type="text" name="discount_value" value={formData.discount_value} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="minimumOrderAmount">
              <Form.Label>Minimum Order Amount</Form.Label>
              <Form.Control type="text" name="minimum_order_amount" value={formData.minimum_order_amount} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="startDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="usageLimit">
              <Form.Label>Usage Limit</Form.Label>
              <Form.Control type="text" name="usage_limit" value={formData.usage_limit} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Coupon'}
            </Button>
            {isError && <p className="text-danger mt-3">{error.message}</p>}
          </Form>
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default CreateCouponScreen;
