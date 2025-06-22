import _ from 'lodash';

import {
    ADD_TO_CART,
    CART_ADD_SUCCESS,
    CART_ADD_FAILED,
    FETCH_CART,
    FETCH_CART_ERROR,
    ACTION_START,
    REMOVE_CART_FAILED,
    REMOVE_CART_SUCCESS,
    REMOVED_QUANTITY_SUCCESS,
    ADD_QUANTITY_SUCCESS,
    CART_UPDATE_SUCCESS,
} from '../actions/Types';

const initialState = {
    error: null,
    message: null,
    loading: false,
    minus_item_id: null,
    data: [],
};
export default (state = initialState, action) => {
    switch (action.type) {
        case ACTION_START:
            return {
                loading: true,
                data: [...state.data],
            };
        case FETCH_CART:
            return {
                data: action.all_carts,
                loading: false,
            };
        case FETCH_CART_ERROR:
            return {
                message: action.message,
                loading: false,
            }
        case ADD_TO_CART:
            return {
                data: [...state.data, action.cart],
                loading: false
            };
        case CART_ADD_SUCCESS:
            return {
                data: [...state.data, action.cart],
                message: action.message,
                loading: false,
            }
        case CART_UPDATE_SUCCESS:
            return {
                data: [...state.data],
                message: action.message,
                loading: false,
            }
        case CART_ADD_FAILED:
            return {
                data: [...state.data],
                message: action.message,
                loading: false,
            }
        case REMOVE_CART_SUCCESS:
            return {
                data: [...state.data.filter(cart => (cart.id !== action.removedItem))],
                loading: false,
            }
        case REMOVED_QUANTITY_SUCCESS:
            return {
                data: [...state.data],
                loading: false,
                minus_item_id: action.minus_item_id,
                message: 'Removed Seccessfully'
            }
        case ADD_QUANTITY_SUCCESS:
            return {
                data: [...state.data],
                loading: false,
                add_item_id: action.minus_item_id,
                message: 'Added Seccessfully'
            }
        default:
            return state;
    }
};
