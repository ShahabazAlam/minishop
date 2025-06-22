import axios from "./../Axios";
import {
    ADD_TO_CART,
    CART_ADD_SUCCESS,
    CART_ADD_FAILED,
    FETCH_CART,
    FETCH_CART_ERROR,
    ACTION_START,
    REMOVE_CART_FAILED,
    REMOVE_CART_SUCCESS,
    CART_UPDATE_SUCCESS,
    REMOVED_QUANTITY_SUCCESS,
    ADD_QUANTITY_SUCCESS,
    QUANTITY_ACTION_FAILED,
    FETCH_PRODUCT_DETAIL_SUCCESS,
    FETCH_PRODUCT_DETAIL_FAILED,
} from './Types';

import { tokenConfig } from './Auth'

export const addToCart = (slug, p_id, color = null, size = null) => async (dispatch, getState) => {
    dispatch({
        type: ACTION_START,
    })
    try {
        const res = await axios.post(`/add-to-cart/`, { slug, p_id, color, size }, tokenConfig(getState));
        if (res.data.cart === 'old') {
            dispatch({
                type: CART_UPDATE_SUCCESS,
                message: res.data.message,
            })
        } else {
            dispatch({
                type: CART_ADD_SUCCESS,
                message: res.data.message,
                cart: res.data.data
            })
        }
    }
    catch (err) {
        const errorMessage = err.response.data.message;
        dispatch({
            type: CART_ADD_FAILED,
            message: errorMessage
        })
    }
}

export const fetchCarts = () => async (dispatch, getState) => {
    dispatch({
        type: ACTION_START,
    })
    try {
        const res = await axios.get(`/fetch-cart/`, tokenConfig(getState));
        dispatch({
            type: FETCH_CART,
            all_carts: res.data
        })
    }
    catch (err) {
        const errorMessage = err.response.data.message;
        dispatch({
            type: FETCH_CART_ERROR,
            message: errorMessage
        })
    }
}


export const removCartItem = (id) => async (dispatch, getState) => {
    dispatch({
        type: ACTION_START,
    })
    try {
        const res = await axios.delete(`/delete-cart/${id}`, tokenConfig(getState));
        dispatch({
            type: REMOVE_CART_SUCCESS,
            removedItem: id,
        })
    }
    catch (err) {
        const errorMessage = err.response.data.message;
        dispatch({
            type: REMOVE_CART_FAILED,
            message: errorMessage,
        })
    }
}

export const AddRemoveItemQuantity = (id, action) => async (dispatch, getState) => {
    dispatch({
        type: ACTION_START,
    })
    try {
        const res = await axios.post(`/change-quantity/`, { id, action }, tokenConfig(getState));
        if (res.data.message === 'removedquantity') {
            dispatch({
                type: REMOVED_QUANTITY_SUCCESS,
                minus_item_id: id,
            })
            return 'removed';
        }
        else if (res.data.message === 'deleted') {
            dispatch({
                type: REMOVE_CART_SUCCESS,
                removedItem: id,
            })
        }
        else if (res.data.message === 'addedquantity') {
            dispatch({
                type: ADD_QUANTITY_SUCCESS,
                add_item_id: id,
            })
        }
        return 'added';
    }
    catch (err) {
        const errorMessage = err.response.data.message;
        dispatch({
            type: QUANTITY_ACTION_FAILED,
            message: errorMessage
        })
    }
}

export const fetchProductDetail = (id) => async (dispatch, getState) => {
    try {
        const res = await axios.get(`/product-detail/${id}`, tokenConfig(getState));
        dispatch({
            type: FETCH_PRODUCT_DETAIL_SUCCESS,
            data: res.data,
        })
    }
    catch (err) {
        const errorMessage = err.response.data.message;
        dispatch({
            type: FETCH_PRODUCT_DETAIL_FAILED,
            message: errorMessage,
        })
    }
}