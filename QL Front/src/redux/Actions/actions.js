
import axios from 'axios';

import {
REGISTER_SUCCESS ,
 REGISTER_FAIL ,
 LOGIN_SUCCESS ,
 LOGIN_FAIL ,

 CREATE_CONTACT_SUCCESS ,
 CREATE_CONTACT_FAIL ,
 GET_ALL_CONTACTS_SUCCESS ,
 GET_ALL_CONTACTS_FAIL ,

 
} from './actions-types'

export const registerAdmin = (adminData) => async (dispatch) => {
    try {
        const response = await axios.post('/auth/register', adminData);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: REGISTER_FAIL,
            payload: error.response.data.message
        });
    }
};


export const loginAdmin = (adminData) => async (dispatch) => {
    try {
        const response = await axios.post('/auth/login', adminData);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: LOGIN_FAIL,
            payload: error.response.data.message
        });
    }
};

export const createContact = (contactData) => async (dispatch) => {
    try {
        const response = await axios.post('/contacts', contactData);
        dispatch({
            type: CREATE_CONTACT_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: CREATE_CONTACT_FAIL,
            payload: error.response.data.message
        });
    }
};

// Acción para obtener todos los contactos
export const getAllContacts = () => async (dispatch) => {
    try {
        const response = await axios.get('/contacts');
        dispatch({
            type: GET_ALL_CONTACTS_SUCCESS,
            payload: response.data
        });
    } catch (error) {
        dispatch({
            type: GET_ALL_CONTACTS_FAIL,
            payload: error.response.data.message
        });
    }
};



// Obtener todos los shows

