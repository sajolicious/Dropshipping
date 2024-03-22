import { MESSAGE_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (chatId) => ({
        url: `${MESSAGE_URL}/${chatId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    sendMessage: builder.mutation({
      query: ({ content, chatId }) => ({
        url: MESSAGE_URL,
        method: 'POST',
        body: { content, chatId },
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useSendMessageMutation,
} = messageApiSlice;

export default messageApiSlice.reducer
