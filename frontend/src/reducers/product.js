import _ from 'lodash';

import {
    FETCH_PRODUCT_DETAIL_SUCCESS,
    FETCH_PRODUCT_DETAIL_FAILED,
} from '../actions/Types';

const initialState = {
    message: null,
    loading: false,
    data: [],
};
export default (state = initialState, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_DETAIL_SUCCESS:
            return {
                loading: false,
                data: action.data,
            }

        default:
            return state;
    }
}