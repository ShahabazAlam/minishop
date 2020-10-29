import axios from 'axios';
import {
    ADDING_COUPON,
    ADDED_COUPON_SUSSESFULLY,
    ADDING_COUPON_FAILED,
    FETCHING_COUPON,
    FETCHING_COUPON_SUCCESS,
    FETCHING_COUPON_FAILED
} from './Types';

import { tokenConfig } from './auth'

//Order actions


export const handleAddCoupon = (code) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADDING_COUPON,
        })
        const res = await axios.post(`/coupon/`, { code }, tokenConfig(getState));
        console.log(res.data)
        dispatch({
            type: ADDED_COUPON_SUSSESFULLY,
            coupon_amount: res.data
        })
    }
    catch (err) {
        dispatch({
            type: ADDING_COUPON_FAILED,
        })
    }
}

export const handlefetchCoupon = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: FETCHING_COUPON,
        })
        const res = await axios.get(`/coupon/`, tokenConfig(getState));
        dispatch({
            type: FETCHING_COUPON_SUCCESS,
            coupon_amount: res.data
        })
    }
    catch (err) {
        dispatch({
            type: FETCHING_COUPON_FAILED,
        })
    }
}