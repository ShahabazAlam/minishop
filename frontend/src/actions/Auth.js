import axios from 'axios';
import { reset, stopSubmit } from 'redux-form';
import { LoginForm } from '../components/auth/Login'
import history from '../history';

import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
} from './types';
import { fetchCarts } from './cartActions'

// LOAD USER
export const loadUser = () => async (dispatch, getState) => {
    dispatch({ type: USER_LOADING });
    try {
        const res = await axios.get('/user/auth/user', tokenConfig(getState));
        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
        dispatch(fetchCarts())
    } catch (err) {
        dispatch({
            type: AUTH_ERROR
        });

    }
};

// REGISTER USER

export const signup = (username, email, password) => async dispatch => {
    //Header
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const body = JSON.stringify({ username, email, password });
    dispatch({ type: USER_LOADING });
    try {

        const res = await axios.post('/user/register/', body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
        history.push('/home');
    } catch (err) {
        const errmsg = err.response.data;
        dispatch({
            type: REGISTER_FAIL,
            errorMessage: errmsg,
        });
    }
}



// LOGIN USER
export const login = (username, password) => async dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Request Body
    const body = JSON.stringify({ username, password });
    dispatch({ type: USER_LOADING });
    try {
        const res = await axios.post('/user/login/', body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });
        dispatch(fetchCarts())
        history.push('/home');
    } catch (err) {
        const errmsg = err.response.data;
        dispatch({
            type: LOGIN_FAIL,
            errorMessage: errmsg,
        });

    }
};

// logout method 
export const logout = () => async (dispatch, getState) => {
    try {
        await axios.post('/user/logout/', null, tokenConfig(getState));
        dispatch({
            type: LOGOUT_SUCCESS
        });
        history.push('/home');
    } catch (err) {
        console.log(err)
    }
};

// helper function
export const tokenConfig = getState => {
    // Get token
    const token = getState().auth.token;
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
};