import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom';

import store from './store';
import history from './history';

import Header from './components/base/Header';
import Footer from './components/base/Footer';

import Home from './components/home/home';
import LogIn from './components/auth/Login';
import Register from './components/auth/Register';
import { loadUser } from './actions/Auth';
import OrderList from './components/home/OrderList';
import ProductDetail from './components/home/ProductDetail';
import CheckOut from './components/home/CheckOut';
import Profile from './components/home/Profile';
import About from './components/home/About';
import Contact from './components/home/Contact';

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <HistoryRouter history={history}>
        <Header />
        <div style={{ marginBottom: '60px', marginTop: '100px' }}>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/home/about" element={<About />} />
            <Route path="/home/contact" element={<Contact />} />
            <Route path="/home/login" element={<LogIn />} />
            <Route path="/home/register" element={<Register />} />
            <Route path="/home/order-list" element={<OrderList />} />
            <Route path="/home/checkout" element={<CheckOut />} />
            <Route path="/home/profile" element={<Profile />} />
            <Route path="/home/product-detail/:id" element={<ProductDetail />} />
          </Routes>
        </div>
        <Footer />
      </HistoryRouter>
    </Provider>
  );
};

export default App;
