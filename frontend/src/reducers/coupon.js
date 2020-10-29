import _ from 'lodash';
import {
    ADDING_COUPON,
    ADDED_COUPON_SUSSESFULLY,
    ADDING_COUPON_FAILED,
    FETCHING_COUPON,
    FETCHING_COUPON_SUCCESS,
    FETCHING_COUPON_FAILED
}
    from '../actions/Types';

const initialState = {
    loading: false,
    coupon_amount: null,
    message: null,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADDING_COUPON, FETCHING_COUPON:
            return {
                loading: true,
            };
        case ADDED_COUPON_SUSSESFULLY:
            return {
                loading: false,
                coupon_amount: action.coupon_amount,
            };
        case FETCHING_COUPON_SUCCESS:
            return {
                loading: false,
                coupon_amount: action.coupon_amount,
            };
        case ADDING_COUPON_FAILED:
            return {
                loading: false,
                message: 'Something went wrong'
            };
        case FETCHING_COUPON_FAILED:
            return {
                loading: false,
                message: 'Something went wrong'
            };
        default:
            return state;
    }
};