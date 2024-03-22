import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { useGetAllCouponsQuery } from '../../slices/couponApiSlice';
import { toast } from 'react-toastify';
import { useDeleteCouponMutation, useDeactivateCouponMutation } from '../../slices/couponApiSlice';

const CouponListScreen = () => {
  const { data: coupons, isLoading, error, refetch } = useGetAllCouponsQuery();
  const [deleteCoupon, { isLoading: loadingDelete }] = useDeleteCouponMutation();
  const [deactivateCoupon, { isLoading: loadingDeactivate }] = useDeactivateCouponMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await deleteCoupon(id);
        refetch();
        toast.success('Coupon deleted successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  const deactivateHandler = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this coupon?')) {
      try {
        await deactivateCoupon(id);
        refetch();
        toast.success('Coupon deactivated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  return (
    <>
      <h1>Coupons</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.message}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Code</th>
              <th>Discount Type</th>
              <th>Discount Value</th>
              <th>Minimum Order Amount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Usage Limit</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon._id}</td>
                <td>{coupon.code}</td>
                <td>{coupon.discount_type}</td>
                <td>{coupon.discount_value}</td>
                <td>{coupon.minimum_order_amount}</td>
                <td>{coupon.start_date}</td>
                <td>{coupon.end_date}</td>
                <td>{coupon.usage_limit}</td>
                <td>{coupon.active ? 'Yes' : 'No'}</td>
                <td>
                  <LinkContainer to={`/admin/updatecoupons/${coupon._id}/edit`} style={{ marginRight: '10px' }}>
                    <Button variant='light' className='btn-sm'>
                      <FaEdit />
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(coupon._id)}>
                    <FaTrash />
                  </Button>
                  {coupon.active && (
                    <Button
                      variant='primary'
                      className='btn-sm'
                      onClick={() => deactivateHandler(coupon._id)}
                      disabled={loadingDeactivate}
                    >
                      {loadingDeactivate ? 'Deactivating...' : 'Deactivate'}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default CouponListScreen;
