import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Home from './home/home';
import { Provider } from 'react-redux';
import store from '../store';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
import Header from '../components/base/Header';
import LogIn from '../components/auth/Login';
import Register from '../components/auth/Register';
import { loadUser } from '../actions/Auth';
import OrderList from './home/OrderList';
import ProductDetail from './home/ProductDetail';
import CheckOut from './home/CheckOut';
import Profile from './home/Profile';
import About from './home/About';
import Contact from './home/Contact';
import Footer from '../components/base/Footer';






class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }


    render() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Header />
                    <div style={{ marginBottom: '60px', marginTop: '100px' }}>
                        <Switch>
                            <Route exact path='/home' component={Home} />
                            <Route exact path='/home/about' component={About} />
                            <Route exact path='/home/contact' component={Contact} />
                            <Route exact path='/home/login' component={LogIn} />
                            <Route exact path='/home/register' component={Register} />
                            <Route path='/home/order-list' component={OrderList} />
                            <Route path='/home/checkout' component={CheckOut} />
                            <Route path='/home/profile' component={Profile} />
                            <Route path='/home/product-detail/:id' component={ProductDetail} />
                        </Switch>
                    </div>
                    <Footer />
                </Router>
            </Provider>
        );
    }
}
ReactDOM.render(<App />, document.querySelector('#app'));