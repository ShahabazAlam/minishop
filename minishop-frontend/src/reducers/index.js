import { combineReducers } from 'redux';
import all_shirts from './shirts';
import all_tshirts from './tshirts';
import all_pants from './pants';
import auth from './auth';
import all_carts from './cart';
import orders from './order';
import cart from './product';
import address from './address';
import coupon from './coupon';

export default combineReducers({
    all_pants,
    all_shirts,
    all_tshirts,
    auth,
    all_carts,
    orders,
    cart,
    address,
    coupon,

});