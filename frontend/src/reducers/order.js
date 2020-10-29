import _ from 'lodash';

import {
    FETCH_ORDERS,
    FETCH_ORDERS_ERROR,
    FETCH_ORDER_START,
    ACTION_START,
    REMOVE_ORDER,
    UPDATE_ORDER,
    ORDER_UPDATE_SUSSESS,
    REMOVE_ORDER_SUCCESS,
} from '../actions/Types';

const initialState = {
    error: null,
    message: null,
    loading: false,
    orders: null,
};
export default (state = initialState, action) => {
    switch (action.type) {
        case ACTION_START:
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};
