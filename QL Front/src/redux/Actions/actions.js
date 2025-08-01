import axios from 'axios';
import Swal from "sweetalert2";


import {
REGISTER_SUCCESS, REGISTER_FAIL, LOGIN_SUCCESS, LOGIN_FAIL,
CREATE_CLIENT_REQUEST, CREATE_CLIENT_SUCCESS, CREATE_CLIENT_FAILURE, 
GET_CLIENT_REQUEST,
GET_CLIENT_SUCCESS,  GET_CLIENT_FAILURE,  UPDATE_CLIENT_REQUEST,   UPDATE_CLIENT_SUCCESS,
UPDATE_CLIENT_FAILURE, DELETE_CLIENT_REQUEST, DELETE_CLIENT_SUCCESS, DELETE_CLIENT_FAILURE,
GET_ALL_CLIENT_REQUEST,   GET_ALL_CLIENT_SUCCESS,  GET_ALL_CLIENT_FAIL,
CREATE_PROPERTY_REQUEST, CREATE_PROPERTY_SUCCESS, CREATE_PROPERTY_FAILURE, 

ADD_PROPERTY_TO_CLIENT_REQUEST,
ADD_PROPERTY_TO_CLIENT_SUCCESS,
ADD_PROPERTY_TO_CLIENT_FAILURE, CREATE_LEASE_REQUEST, CREATE_LEASE_SUCCESS, CREATE_LEASE_FAILURE,
GET_PROPERTIES_BY_CLIENT_REQUEST,  GET_PROPERTIES_BY_CLIENT_SUCCESS,  GET_PROPERTIES_BY_CLIENT_FAILURE ,
GET_PROPERTIES_BY_TYPE_REQUEST, GET_PROPERTIES_BY_TYPE_SUCCESS , GET_PROPERTIES_BY_TYPE_FAILURE, 
UPDATE_PROPERTY_REQUEST,  UPDATE_PROPERTY_SUCCESS,  UPDATE_PROPERTY_FAILURE , DELETE_PROPERTY_REQUEST , DELETE_PROPERTY_SUCCESS,
DELETE_PROPERTY_FAILURE, 
GET_FILTERED_PROPERTIES_REQUEST,  GET_FILTERED_PROPERTIES_SUCCESS,  GET_FILTERED_PROPERTIES_FAILURE,
GET_ALL_PROPERTIES_REQUEST, GET_ALL_PROPERTIES_SUCCESS, GET_ALL_PROPERTIES_FAILURE,
GET_PROPERTIES_BY_ID_REQUEST, GET_PROPERTIES_BY_ID_SUCCESS, GET_PROPERTIES_BY_ID_FAILURE,

CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILURE,
  GET_PAYMENTS_BY_LEASE_REQUEST,
  GET_PAYMENTS_BY_LEASE_SUCCESS,
  GET_PAYMENTS_BY_LEASE_FAILURE,
  GET_PAYMENTS_BY_CLIENT_REQUEST,
  GET_PAYMENTS_BY_CLIENT_SUCCESS,
  GET_PAYMENTS_BY_CLIENT_FAILURE,

  GET_ALL_LEASES_REQUEST, GET_ALL_LEASES_SUCCESS,  GET_ALL_LEASES_FAILURE,
  GET_LEASES_BY_CLIENT_REQUEST,
  GET_LEASES_BY_CLIENT_SUCCESS,
  GET_LEASES_BY_CLIENT_FAILURE,
  GET_LEASE_REQUEST,
  GET_LEASE_SUCCESS,
  GET_LEASE_FAILURE,
  GET_ALL_PAYMENTS_REQUEST,
  GET_ALL_PAYMENTS_SUCCESS,
  GET_ALL_PAYMENTS_FAILURE,

  CREATE_GUARANTORS_REQUEST,
  CREATE_GUARANTORS_SUCCESS,
  CREATE_GUARANTORS_FAIL,
  GET_GUARANTORS_REQUEST,
  GET_GUARANTORS_SUCCESS,
  GET_GUARANTORS_FAIL,
  UPDATE_LEASE_RENT_REQUEST,
  UPDATE_LEASE_RENT_SUCCESS,
  UPDATE_LEASE_RENT_FAILURE,
   VERIFY_TOKEN_REQUEST,
  VERIFY_TOKEN_SUCCESS,
  VERIFY_TOKEN_FAILURE,
  LOGOUT,
  SET_TOKEN


} from './actions-types'

export const registerAdmin = (adminData) => async (dispatch) => {
  try {
    const response = await axios.post('/auth/register', adminData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: REGISTER_FAIL,
      payload: error.response?.data?.message || 'Error al registrar administrador',
    });
  }
};

export const loginAdmin = (adminData) => async (dispatch) => {
  try {
    const response = await axios.post('/auth/login', adminData);
    localStorage.setItem('token', response.data.token);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: response.data.token,
        admin: response.data.admin,
      },
    });
    return { type: "LOGIN_SUCCESS" };
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response?.data?.message || 'Error al iniciar sesión',
    });
    return { type: "LOGIN_FAIL" };
  }
}
export const verifyToken = () => async (dispatch) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    dispatch({ type: LOGIN_FAIL, payload: 'No hay token' });
    return;
  }

  try {
    const response = await axios.get('/auth/verify', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: {
        token: token,
        admin: response.data.admin,
      },
    });
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    localStorage.removeItem('token');
    dispatch({
      type: LOGIN_FAIL,
      payload: 'Token inválido',
    });
  }
};

export const createClient = (clientData) => async (dispatch) => {
  dispatch({ type: CREATE_CLIENT_REQUEST });

  try {
    const response = await axios.post(`/client`, clientData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch({ type: CREATE_CLIENT_SUCCESS, payload: response.data });
    return response.data; // Devuelve el cliente creado
  } catch (error) {
    const errorMessage = error.response?.data?.details || error.message;
    dispatch({ type: CREATE_CLIENT_FAILURE, payload: errorMessage });
    throw errorMessage; // Lanza el error para que el componente lo maneje
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
      const response = await axios.post(`/property`, propertyData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      dispatch({ type: CREATE_PROPERTY_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({
        type: CREATE_PROPERTY_FAILURE,
        payload: error.response?.data?.message || 'Error al crear la propiedad',
      });
    }
  };
  

  export const getAllProperties = () => async (dispatch) => {
    dispatch({ type: GET_ALL_PROPERTIES_REQUEST });
    try {
      const response = await axios.get('/property');
      dispatch({ type: GET_ALL_PROPERTIES_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: GET_ALL_PROPERTIES_FAILURE, payload: error.message });
      Swal.fire("Error", "No se pudieron obtener las propiedades", "error");
    }
  };
  
  export const addPropertyToClientWithRole = ({ propertyId, idClient, role }) => async (dispatch) => {
    dispatch({ type: ADD_PROPERTY_TO_CLIENT_REQUEST });
    console.log('Inicio de la acción addPropertyToClientWithRole');
    console.log('Datos enviados:', { propertyId, idClient, role });

    try {
        const response = await axios.post(`/clientRole/addRole`, {
            idClient,
            propertyId,
            role,
        });
        console.log('Respuesta del backend:', response.data);

        dispatch({
            type: ADD_PROPERTY_TO_CLIENT_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        console.error('Error al hacer la solicitud:', error);
        console.error('Error response payload:', error.response ? error.response.data : 'Sin respuesta del servidor');

        dispatch({
            type: ADD_PROPERTY_TO_CLIENT_FAILURE,
            payload: error.response ? error.response.data : { error: 'Error desconocido' },
        });
    }
};



export const getPropertiesByClient = (idClient) => async (dispatch) => {
  dispatch({ type: GET_PROPERTIES_BY_CLIENT_REQUEST });
  try {
    const response = await axios.get(`/property/${idClient}`);
    dispatch({ type: GET_PROPERTIES_BY_CLIENT_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_PROPERTIES_BY_CLIENT_FAILURE, payload: error.message });
    Swal.fire("Error", "No se pudieron obtener las propiedades del cliente", "error");
  }
};

export const getPropertiesByType = (type) => async (dispatch) => {
  dispatch({ type: GET_PROPERTIES_BY_TYPE_REQUEST });
  try {
    const response = await axios.get(`/property/type/${type}`);
    dispatch({ type: GET_PROPERTIES_BY_TYPE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_PROPERTIES_BY_TYPE_FAILURE, payload: error.message });
    Swal.fire("Error", "No se pudieron obtener las propiedades por tipo", "error");
  }
};

export const getPropertiesById = (propertyId) => async (dispatch) => {
  dispatch({ type: GET_PROPERTIES_BY_ID_REQUEST });
  try {
    const response = await axios.get(`/property/${propertyId}`);
    
    // Verificar si la propiedad está disponible
    if (!response.data.isAvailable) {
      Swal.fire({
        title: "Propiedad No Disponible",
        text: "Esta propiedad ya tiene un contrato activo",
        icon: "warning"
      });
    }
    
    dispatch({ type: GET_PROPERTIES_BY_ID_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: GET_PROPERTIES_BY_ID_FAILURE, payload: error.message });
    Swal.fire({
      title: "Error",
      text: "No se pudo obtener la información de la propiedad",
      icon: "error"
    });
    throw error;
  }
};

export const updateProperty = (propertyId, propertyData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROPERTY_REQUEST });
  try {
    const response = await axios.put(`/property/${propertyId}`, propertyData);
    dispatch({ type: UPDATE_PROPERTY_SUCCESS, payload: response.data });
    Swal.fire("Éxito", "Propiedad actualizada correctamente", "success");
  } catch (error) {
    dispatch({ type: UPDATE_PROPERTY_FAILURE, payload: error.message });
    Swal.fire("Error", "No se pudo actualizar la propiedad", "error");
  }
};

export const deleteProperty = (propertyId) => async (dispatch) => {
  dispatch({ type: DELETE_PROPERTY_REQUEST });
  try {
    const response = await axios.delete(`/property/${propertyId}`);
    dispatch({ type: DELETE_PROPERTY_SUCCESS, payload: response.data });
    Swal.fire("Éxito", "Propiedad eliminada correctamente", "success");
  } catch (error) {
    dispatch({ type: DELETE_PROPERTY_FAILURE, payload: error.message });
    Swal.fire("Error", "No se pudo eliminar la propiedad", "error");
  }
};

export const getFilteredProperties = (filters) => async (dispatch) => {
  dispatch({ type: GET_FILTERED_PROPERTIES_REQUEST });
  try {
    const response = await axios.get(`/property/filter`, { params: filters });
    dispatch({ type: GET_FILTERED_PROPERTIES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_FILTERED_PROPERTIES_FAILURE, payload: error.message });
    Swal.fire("Error", "No se pudieron filtrar las propiedades", "error");
  }
};

export const createLease = (leaseData) => async (dispatch) => {
  dispatch({ type: CREATE_LEASE_REQUEST });

  try {
    console.log("Enviando datos del contrato:", leaseData);

    const response = await axios.post(`/lease`, leaseData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Respuesta del backend:", response.data);

    dispatch({ type: CREATE_LEASE_SUCCESS, payload: response.data });

    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error completo al crear el contrato:", error);
    console.error("Error response:", error.response);
    console.error("Error request:", error.request);

    // Extraer mensaje de error más específico
    let errorMessage = "Ocurrió un error al crear el contrato.";
    let errorDetails = "";
    let serverError = "";

    if (error.response) {
      // Error del servidor (4xx, 5xx)
      const status = error.response.status;
      const data = error.response.data;
      
      console.error("Respuesta del servidor:", {
        status,
        statusText: error.response.statusText,
        data
      });

      if (status === 500) {
        errorMessage = "Error interno del servidor";
        serverError = data?.error || data?.message || "Error interno del servidor";
        errorDetails = data?.details || "El servidor encontró un error inesperado";
      } else if (status === 400) {
        errorMessage = "Error en los datos enviados";
        serverError = data?.error || data?.message || "Datos inválidos";
        errorDetails = data?.details || "Verifica que todos los campos sean correctos";
      } else if (status === 404) {
        errorMessage = "Recurso no encontrado";
        serverError = data?.error || data?.message || "Recurso no encontrado";
        errorDetails = data?.details || "El endpoint o recurso solicitado no existe";
      } else {
        errorMessage = `Error ${status}`;
        serverError = data?.error || data?.message || error.response.statusText;
        errorDetails = data?.details || "";
      }
    } else if (error.request) {
      // Error de red
      errorMessage = "Error de conexión";
      serverError = "No se pudo conectar con el servidor";
      errorDetails = "Verifica tu conexión a internet o que el servidor esté disponible";
    } else {
      // Error de configuración
      errorMessage = "Error de configuración";
      serverError = error.message;
      errorDetails = "Error en la configuración de la petición";
    }

    const fullErrorMessage = `${errorMessage}: ${serverError}${errorDetails ? `\n\nDetalles: ${errorDetails}` : ''}`;

    dispatch({ 
      type: CREATE_LEASE_FAILURE, 
      payload: fullErrorMessage 
    });

    return { 
      success: false, 
      error: errorMessage,
      serverError: serverError,
      details: errorDetails,
      fullError: fullErrorMessage,
      status: error.response?.status || null
    };
  }
};

export const createPayment = (paymentData) => async (dispatch) => {
  dispatch({ type: CREATE_PAYMENT_REQUEST });
  try {
    const response = await axios.post("/payment", paymentData);
    dispatch({
      type: CREATE_PAYMENT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: CREATE_PAYMENT_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const getPaymentsByLeaseId = (leaseId) => async (dispatch) => {
  dispatch({ type: GET_PAYMENTS_BY_LEASE_REQUEST });
  try {
    const response = await axios.get(`/payment/${leaseId}`);
    dispatch({
      type: GET_PAYMENTS_BY_LEASE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_PAYMENTS_BY_LEASE_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const getPaymentsByClient = (idClient) => async (dispatch) => {
  dispatch({ type: GET_PAYMENTS_BY_CLIENT_REQUEST });
  try {
    const response = await axios.get(`/payment/${idClient}`);
    dispatch({
      type: GET_PAYMENTS_BY_CLIENT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_PAYMENTS_BY_CLIENT_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const getAllLeases = () => async (dispatch) => {
  dispatch({ type: GET_ALL_LEASES_REQUEST });
  try {
    const response = await axios.get('/lease/all');
    dispatch({ type: GET_ALL_LEASES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: GET_ALL_LEASES_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
    Swal.fire("Error", "No se pudieron obtener los contratos", "error");
  }
};

export const getLeasesByIdClient = (idClient) => async (dispatch) => {
  dispatch({ type: GET_LEASES_BY_CLIENT_REQUEST });
  try {
    const response = await axios.get(`/lease/client/${idClient}`);
    dispatch({
      type: GET_LEASES_BY_CLIENT_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_LEASES_BY_CLIENT_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const getAllPayments = () => async (dispatch) => {
  dispatch({ type: GET_ALL_PAYMENTS_REQUEST });
  try {
    const response = await axios.get('/payment');
    dispatch({
      type: GET_ALL_PAYMENTS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_ALL_PAYMENTS_FAILURE,
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const createGarantorsForLease = (leaseId, guarantors) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_GUARANTORS_REQUEST });

    const { data } = await axios.post(`/garantor/${leaseId}`, { guarantors });

    dispatch({
      type: CREATE_GUARANTORS_SUCCESS,
      payload: data,
    });

    return data; // Return the data so it's available in the component
  } catch (error) {
    dispatch({
      type: CREATE_GUARANTORS_FAIL,
      payload: error.response && error.response.data.error
        ? error.response.data.error
        : error.message,
    });
    throw error; // Throw the error to handle it in the component
  }
};


export const getGarantorsByLeaseId = (leaseId) => async (dispatch) => {
  dispatch({ type: GET_GUARANTORS_REQUEST });
  try {
    const { data } = await axios.get(`/lease/${leaseId}/garantors`);
    dispatch({
      type: GET_GUARANTORS_SUCCESS,
      payload: data.guarantors, // suponer que la respuesta tiene { guarantors: [...] }
    });
  } catch (error) {
    dispatch({
      type: GET_GUARANTORS_FAIL,
      payload: error.response && error.response.data.error
        ? error.response.data.error
        : error.message,
    });
  }
};

// Acción para obtener un contrato por leaseId
export const getLeaseById = (leaseId) => async (dispatch) => {
  try {
    dispatch({ type: GET_LEASE_REQUEST });
    const { data } = await axios.get(`/lease/${leaseId}`);
    dispatch({ type: GET_LEASE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_LEASE_FAILURE,
      payload: error.response?.data?.message || "Error al obtener el contrato",
    });
  }
};

export const updateLeaseRentAmount = (leaseId, newRentAmount, updateDate, pdfData, fileName) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_LEASE_RENT_REQUEST });

    const response = await axios.put(`/lease/${leaseId}/rent`, {
      newRentAmount,
      updateDate,
      pdfData,
      fileName,
    });

    dispatch({
      type: UPDATE_LEASE_RENT_SUCCESS,
      payload: response.data, // Datos del contrato actualizado
    });

    Swal.fire("Éxito", "El monto del alquiler se actualizó correctamente.", "success");
  } catch (error) {
    dispatch({
      type: UPDATE_LEASE_RENT_FAILURE,
      payload: error.response?.data?.message || "Error al actualizar el monto del alquiler",
    });

    Swal.fire("Error", error.response?.data?.message || "No se pudo actualizar el monto del alquiler.", "error");
  }
};