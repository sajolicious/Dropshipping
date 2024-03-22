import { COUPON_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const couponApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPON_URL}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),
    getAllCoupons: builder.query({
      query: () => ({
        url: COUPON_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    updateCoupon: builder.mutation({
      query: (data) => ({
        url: `${COUPON_URL}/${data.couponId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),
    getCouponDetails: builder.query({
      query: (couponId) => ({
        url: `${COUPON_URL}/${couponId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    deleteCoupon: builder.mutation({
        query: (couponId)=> ({
            url: `${COUPON_URL}/${couponId}`,
            method: 'DELETE',

        })
    }),
    deactivateCoupon: builder.mutation({
        query: (couponId)=> ({
            url: `${COUPON_URL}/${couponId}`,
            method: 'PUT'
        })
    }),
    validateCoupon: builder.mutation({
    query: ({ couponCode, totalPrice }) => ({
        url: `${COUPON_URL}/validate`,
        method: 'POST',
        params: { couponCode, totalPrice },
    }),
}),
  }),
})

export const {
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
  useGetCouponDetailsQuery,
  useDeleteCouponMutation,
  useDeactivateCouponMutation,
  useValidateCouponMutation
} = couponApiSlice

export default couponApiSlice.reducer
