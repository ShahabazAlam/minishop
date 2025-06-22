import _ from 'lodash';
import { GET_TSHIRT_PRODUCTS } from '../actions/Types'; // added ADD_TODO


export default (tshirts = {}, action) => {
    switch (action.type) {
        case GET_TSHIRT_PRODUCTS:
            return {
                ...tshirts,
                ..._.mapKeys(action.all_tshirts, 'id'),
            };
        default:
            return tshirts;
    }
};