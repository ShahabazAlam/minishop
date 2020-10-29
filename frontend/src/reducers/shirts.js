import _ from 'lodash';
import { GET_SHIRT_PRODUCTS } from '../actions/Types'; // added ADD_TODO


export default (shirts = {}, action) => {
    switch (action.type) {
        case GET_SHIRT_PRODUCTS:
            return {
                ...shirts,
                ..._.mapKeys(action.all_shirts, 'id'),
            };
        default:
            return shirts;
    }
};