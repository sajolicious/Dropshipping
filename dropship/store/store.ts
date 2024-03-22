"Use Client "
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { apiSlice } from '@/slices/apiSlice';
import cartSliceReducer, { CartState } from '@/slices/cartSlice';
import authSliceReducer, { AuthState } from '@/slices/authSlice';
import messageSliceReducer, { MessageState } from '@/slices/messageSlice';


export interface RootState {
    cart: CartState;
    auth: AuthState;
    message: MessageState;

}

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer,
        message: messageSliceReducer
        // Add other slice reducers here
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export default store;
