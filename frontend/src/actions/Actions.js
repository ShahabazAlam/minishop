import axios from 'axios';
import { GET_SHIRT_PRODUCTS, GET_PANT_PRODUCTS, GET_TSHIRT_PRODUCTS, ACTION_START } from './Types';


export const getShirts = () => async (dispatch) => {
    dispatch({
        type: ACTION_START,
    })
    var slug = 'shirts';
    const res = await axios.get(`/products/${slug}/`);
    dispatch({
        type: GET_SHIRT_PRODUCTS,
        all_shirts: res.data
    })
}

export const getTshirts = () => async (dispatch) => {
    dispatch({
        type: ACTION_START,
    })
    var slug = 'tshirts';
    const res = await axios.get(`/products/${slug}/`);
    dispatch({
        type: GET_TSHIRT_PRODUCTS,
        all_tshirts: res.data
    })
}

export const getPants = () => async (dispatch) => {
    dispatch({
        type: ACTION_START,
    })
    var slug = 'pants';
    const res = await axios.get(`/products/${slug}/`);
    dispatch({
        type: GET_PANT_PRODUCTS,
        all_pants: res.data
    })
}