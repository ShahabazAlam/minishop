import axios from "./../Axios";
import {
    FETCH_ORDERS,
    ACTION_START,
    FETCH_ORDER_ERROR
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