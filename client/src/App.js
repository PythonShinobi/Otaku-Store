// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './redux/store';
import ProductsPage from './product/ProductsPage';
import ProductDetailsPage from './product/ProductsDetailsPage';
import Home from './home/Home';
import About from './about/About';
import ContactPage from './contact/Contact';
import CategoryPage from './category-page/CategoryPage';
import Cart from './cart/Cart';
import Login from './login/login';
import Register from './register/register';
import Checkout from './checkout/Checkout';
import PageNotFound from './404-page/PageNotFound';
import PrivateRoute from './components/PrivateRoute';
import AdminPage from './components/AdminPage';
import UserProfile from './profile/Profile';

const App = () => {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          {/* Define routes for different pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<PageNotFound />} />
          <Route path="/product/*" element={<PageNotFound />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route 
            path="/profile" 
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <PrivateRoute>
                  <Checkout />
              </PrivateRoute>
            } />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
        />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
};

export default App;