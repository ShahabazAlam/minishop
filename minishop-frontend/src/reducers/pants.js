import _ from 'lodash';
import { GET_PANT_PRODUCTS } from '../actions/Types'; // added ADD_TODO


export default (pants = {}, action) => {
    switch (action.type) {
        case GET_PANT_PRODUCTS:
            return {
                ...pants,
                ..._.mapKeys(action.all_pants, 'id'),
            };
        default:
            return pants;
    }
};