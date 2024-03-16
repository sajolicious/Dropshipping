"use client" 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import store from './store';

import Footer from './components/Footer';
import HomeScreen from './screens/HomeSceen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import SearchBox from './components/SearchBox';
import CategoryScreen from './screens/CategoryScreen';
import ProductCreateScreen from './screens/admin/ProductCreateScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import ProductListScreen from './screens/admin/ProductListScreen';
import ProductEditScreen from './screens/admin/ProductEditScreen';
import UserListScreen from './screens/admin/UsersListScreen';
import UserEditScreen from './screens/admin/UserEditScreen';
import ChatArea from './screens/chatScreen/ChatArea';
import CreateSingleChat from './screens/chatScreen/createSingleChat';
const Page = () => {
  return (
    <HelmetProvider>
      <Provider store={store}>
        <Router>
     
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/search/:keyword" element={<HomeScreen />} />
            <Route path="/page/:pageNumber" element={<HomeScreen />} />
            <Route
              path="/search/:keyword/page/:pageNumber"
              element={<HomeScreen />}
            />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/product/category" element={<CategoryScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/createchat" element={<CreateSingleChat />} />
            <Route path="/chat/:chatId" element={<ChatArea />} />
            <Route element={<PrivateRoute />}>
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
              <Route
                path="/admin/productlist"
                element={<ProductListScreen />}
              />
              <Route
                path="/admin/createproduct"
                element={<ProductCreateScreen />}
              />
              <Route
                path="/admin/productlist/:pageNumber"
                element={<ProductListScreen />}
              />
              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route
                path="/admin/product/:id/edit"
                element={<ProductEditScreen />}
              />
              <Route
                path="/admin/user/:id/edit"
                element={<UserEditScreen />}
              />
            </Route>
          </Routes>
          <Footer />
        </Router>
      </Provider>
    </HelmetProvider>
  );
};

export default Page;
