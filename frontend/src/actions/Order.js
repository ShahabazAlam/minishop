import axios from 'axios';
import {
    FETCH_ORDERS,
    FETCH_ORDERS_ERROR,
    FETCH_ORDER_START,
    ACTION_START,
    REMOVE_ORDER,
    UPDATE_ORDER,
    ORDER_UPDATE_SUSSESS,
    REMOVE_ORDER_SUCCESS,
} from './Types';

import { tokenConfig } from './auth'

//Order actions


export const fetchOrders = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ACTION_START,
        })
        const res = await axios.get(`/fetch-order-summery/`, tokenConfig(getState));
        dispatch({
            type: FETCH_ORDERS,
            all_carts: res.data
        })
    }
    catch (err) {
        const errorMessage = err.response.data;
        dispatch({
            type: FETCH_ORDER_ERROR,
            error: errorMessage
        })
    }
}