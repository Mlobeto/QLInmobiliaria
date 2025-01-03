
import axios from 'axios';
import Swal from "sweetalert2";


import {
REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_SUCCESS, LOGIN_FAIL,
CREATE_CLIENT_REQUEST, CREATE_CLIENT_SUCCESS, CREATE_CLIENT_FAILURE, GET_CLIENT_REQUEST,
GET_CLIENT_SUCCESS,  GET_CLIENT_FAILURE,  UPDATE_CLIENT_REQUEST,   UPDATE_CLIENT_SUCCESS,
UPDATE_CLIENT_FAILURE, DELETE_CLIENT_REQUEST, DELETE_CLIENT_SUCCESS, DELETE_CLIENT_FAILURE,
GET_ALL_CLIENT_REQUEST,   GET_ALL_CLIENT_SUCCESS,  GET_ALL_CLIENT_FAIL,
CREATE_PROPERTY_REQUEST, CREATE_PROPERTY_SUCCESS, CREATE_PROPERTY_FAILURE, RESET_CREATE_PROPERTY_STATE,
ADD_PROPERTY_TO_CLIENT_REQUEST,
ADD_PROPERTY_TO_CLIENT_SUCCESS,
ADD_PROPERTY_TO_CLIENT_FAILURE

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


export const createClient = (clientData) => async (dispatch) => {
    dispatch({ type: CREATE_CLIENT_REQUEST });
  
    try {
      await axios.post(`/client`, clientData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      dispatch({ type: CREATE_CLIENT_SUCCESS });
  
      // Mostrar alerta de éxito
      Swal.fire({
        title: "¡Éxito!",
        text: "Cliente creado correctamente",
        icon: "success",
      });
    } catch (error) {
      dispatch({ type: CREATE_CLIENT_FAILURE, payload: error.message });
  
      // Mostrar alerta de error
      if (error.response?.data?.message === "CUIL ya registrado") {
        Swal.fire({
          title: "Error",
          text: "El CUIL ya está registrado. Intenta con otro.",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al crear el cliente. Intenta nuevamente.",
          icon: "error",
        });
      }
    }
  };
  

  export const getAllClients = () => async (dispatch) => {
    dispatch({ type: GET_ALL_CLIENT_REQUEST });
  
    try {
      const response = await axios.get('/client');
  
      dispatch({
        type: GET_ALL_CLIENT_SUCCESS,
        payload: response.data, // Lista de clientes
      });
    } catch (error) {
      dispatch({
        type: GET_ALL_CLIENT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

  export const getClientById = (idClient) => async (dispatch) => {
    dispatch({ type: GET_CLIENT_REQUEST });
  
    try {
      const response = await axios.get(`/client/${idClient}`);
      dispatch({
        type: GET_CLIENT_SUCCESS,
        payload: response.data, // Información del cliente
      });
    } catch (error) {
      dispatch({
        type: GET_CLIENT_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  // Acción para actualizar un cliente
  export const updateClient = (idClient, clientData) => async (dispatch) => {
    dispatch({ type: UPDATE_CLIENT_REQUEST });
  
    try {
      await axios.put(`/client/${idClient}`, clientData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      dispatch({
        type: UPDATE_CLIENT_SUCCESS,
        payload: { idClient, ...clientData }, // Se actualiza con los datos del cliente modificado
      });
    } catch (error) {
      dispatch({
        type: UPDATE_CLIENT_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };
  
  // Acción para eliminar un cliente
  export const deleteClient = (idClient) => async (dispatch) => {
    dispatch({ type: DELETE_CLIENT_REQUEST });
  
    try {
      await axios.delete(`/client/${idClient}`);
      dispatch({
        type: DELETE_CLIENT_SUCCESS,
        payload: idClient, // Se elimina por ID
      });
    } catch (error) {
      dispatch({
        type: DELETE_CLIENT_FAILURE,
        payload: error.response?.data?.message || error.message,
      });
    }
  };


  export const createProperty = (propertyData) => async (dispatch) => {
    dispatch({ type: CREATE_PROPERTY_REQUEST });
  
    try {
      console.log("Enviando datos de la propiedad:", propertyData); // Agregar log aquí para ver los datos antes de enviarlos
  
      const response = await axios.post(`/property`, propertyData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      console.log("Respuesta del backend:", response); // Agregar log para ver la respuesta del backend
  
      dispatch({ type: CREATE_PROPERTY_SUCCESS, payload: response.data });
  
      // Mostrar alerta de éxito
      Swal.fire({
        title: "¡Éxito!",
        text: "Propiedad creada correctamente",
        icon: "success",
      });
    } catch (error) {
      console.log("Error al crear propiedad:", error); // Ver qué tipo de error se recibe
  
      dispatch({ type: CREATE_PROPERTY_FAILURE, payload: error.message });
  
      // Mostrar alerta de error
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error al crear la propiedad.";
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    }
  };
  
  export const addPropertyToClientWithRole = (idClient, propertyId, role) => async (dispatch) => {
    dispatch({ type: ADD_PROPERTY_TO_CLIENT_REQUEST });

    try {
        const response = await axios.post('/api/properties/add-client-role', {
            idClient,
            propertyId,
            role,
        });

        dispatch({
            type: ADD_PROPERTY_TO_CLIENT_SUCCESS,
            payload: response.data, // La respuesta que regresa del backend
        });
    } catch (error) {
        dispatch({
            type: ADD_PROPERTY_TO_CLIENT_FAILURE,
            payload: error.response ? error.response.data : { error: 'Error desconocido' },
        });
    }
};
  