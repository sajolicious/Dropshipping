import { CHAT_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const chatSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createChat: builder.mutation({
            query: (chatId) => ({
              url: CHAT_URL,
              method: 'POST',
              body: chatId,
            }),
            invalidatesTags: ['chatId'],
          }),
    }),
});


export const { useCreateChatMutation } = chatSlice;