import { apiSlice } from './apiSlice';
import { ORDERS_URL, BKASH_URL } from '../constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createOrder: builder.mutation({
        query: (order) => ({
            url: ORDERS_URL,
            method: 'POST',
            body: { ...order }
        }),
      }),
      getOrderDetails: builder.query({
        query: (orderId) => ({
          url: `${ORDERS_URL}/${orderId}`
        }),
        keepUnusedDataFor: 5
      }),
      payOrder: builder.mutation({
        query: ({ orderId, details }) => ({
          url: `${ORDERS_URL}/${orderId}/pay`,
          method: 'PUT',
          body: details, 
        }),
        keepUnusedDataFor: 5
      }),
      
      getBkashClientId: builder.query({
        query: () => ({
          url: BKASH_URL
        }),
        keepUnusedDataFor: 5
      }),
      getMyOrders: builder.query({
        query: ()=> ({
          url: `${ORDERS_URL}/mine`
        }),
        keepUnusedDataFor: 5,
      }),
      getOrders: builder.query({
        query: () => ({
          url: ORDERS_URL,
        }),
        keepUnusedDataFor: 5
      }),
      deliverOrder: builder.mutation({
        query: (orderId) => ({
          url: `${ORDERS_URL}/${orderId}/deliver`,
          method: 'PUT',
        })
      })
    }),
});

export const { useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation, useGetBkashClientIdQuery, useGetMyOrdersQuery, useGetOrdersQuery, useDeliverOrderMutation } = ordersApiSlice;
