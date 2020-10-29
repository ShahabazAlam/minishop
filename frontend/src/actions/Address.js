import axios from 'axios';
import {
    ADDRESS_SAVING,
    ADDRESS_SAVED_SUCCESSFULLY,
    ADDESS_SAVING_FAIED,
    ADDRESS_UPDATING,
    ADDRESS_UPDATE_FAILED,
    ADDRESS_UPDATE_SUCCESSFULLY,
    ADDRESS_FETCHED_SUCCESSFULLY,
    ADDRESS_FETCHING,
    ADDRESS_FETCHING_FAIED,
    ADDRESS_DELETING,
    ADDRESS_DELETING_SUCCESSFULLY,
    ADDRESS_DELETING_FAIED,
} from './Types';

import { tokenConfig } from './auth'

//Order actions


export const saveAddress = (formData) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADDRESS_SAVING,
        })
        const res = await axios.post(`/create-address/`, formData, tokenConfig(getState));
        dispatch({
            type: ADDRESS_SAVED_SUCCESSFULLY,
            address: res.data
        })
        return 'success';
    }
    catch (err) {
        const errorMessage = err.response.data;
        dispatch({
            type: ADDESS_SAVING_FAIED,
            error: errorMessage
        })
    }
}

export const fetchAddresses = (addressType = null) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADDRESS_FETCHING,
        })
        const res = await axios.get(`/fetch-address/?address_type=${addressType}`, tokenConfig(getState));
        dispatch({
            type: ADDRESS_FETCHED_SUCCESSFULLY,
            address: res.data
        })
    }
    catch (err) {
        const errorMessage = err.response.data;
        dispatch({
            type: ADDRESS_FETCHING_FAIED,
            error: errorMessage
        })
    }
}

export const deleteAddresses = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADDRESS_DELETING,
        })
        const res = await axios.delete(`/delete-address/${id}`, tokenConfig(getState));
        dispatch({
            type: ADDRESS_DELETING_SUCCESSFULLY,
            deleted_address: id
        })
    }
    catch (err) {
        const errorMessage = err.response.data;
        dispatch({
            type: ADDRESS_DELETING_FAIED,
            error: errorMessage
        })
    }
}


export const makeDefaultAddresses = (id, address_type) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ADDRESS_UPDATING,
        })
        const res = await axios.post(`/make-address-default/`, { id, address_type }, tokenConfig(getState));
        dispatch({
            type: ADDRESS_UPDATE_SUCCESSFULLY,
        })
        return 'success';
    }
    catch (err) {
        const errorMessage = err.response.data;
        dispatch({
            type: ADDRESS_UPDATE_FAILED,
            error: errorMessage
        })
    }
}