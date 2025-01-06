import {
  CREATE_CLIENT_REQUEST,
  CREATE_CLIENT_SUCCESS,
  CREATE_CLIENT_FAILURE,
  GET_ALL_CLIENT_REQUEST,
  GET_ALL_CLIENT_SUCCESS,
  GET_ALL_CLIENT_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  GET_CLIENT_REQUEST,
  GET_CLIENT_SUCCESS,
  GET_CLIENT_FAILURE,
  UPDATE_CLIENT_REQUEST,
  UPDATE_CLIENT_SUCCESS,
  UPDATE_CLIENT_FAILURE,
  DELETE_CLIENT_REQUEST,
  DELETE_CLIENT_SUCCESS,
  DELETE_CLIENT_FAILURE,
  CREATE_PROPERTY_REQUEST,
  CREATE_PROPERTY_SUCCESS,
  CREATE_PROPERTY_FAILURE,
  RESET_CREATE_PROPERTY_STATE,
  ADD_PROPERTY_TO_CLIENT_REQUEST,
  ADD_PROPERTY_TO_CLIENT_SUCCESS,
  ADD_PROPERTY_TO_CLIENT_FAILURE,
  CREATE_LEASE_REQUEST,
  CREATE_LEASE_SUCCESS,
  CREATE_LEASE_FAILURE,
  GET_PROPERTIES_BY_CLIENT_REQUEST,
  GET_PROPERTIES_BY_CLIENT_SUCCESS,
  GET_PROPERTIES_BY_CLIENT_FAILURE,
  GET_PROPERTIES_BY_TYPE_REQUEST,
  GET_PROPERTIES_BY_TYPE_SUCCESS,
  GET_PROPERTIES_BY_TYPE_FAILURE,
  UPDATE_PROPERTY_REQUEST,
  UPDATE_PROPERTY_SUCCESS,
  UPDATE_PROPERTY_FAILURE,
  DELETE_PROPERTY_REQUEST,
  DELETE_PROPERTY_SUCCESS,
  DELETE_PROPERTY_FAILURE,
  GET_FILTERED_PROPERTIES_REQUEST,
  GET_FILTERED_PROPERTIES_SUCCESS,
  GET_FILTERED_PROPERTIES_FAILURE


} from "../Actions/actions-types";

const initialState = {
  adminInfo: null,
  propertyClientData: null,
  token: null,
  clients: [],
  client: null,
  property: null,
  properties: [],
  lease: null,
  leases: [],
  filteredProperties: [],
  loading: false,
  error: null,
  clientCreate: {
    loading: false,
    success: false,
    error: null,
  },
  propertyCreate: {
    loading: false,
    success: false,
    error: null,
  },
  leaseCreate: {
    loading: false,
    success: false,
    error: null,
  },
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        adminInfo: action.payload.admin,
        token: action.payload.token,
        error: null,
      };

    case REGISTER_FAIL:
    case LOGIN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    // Crear cliente
    case CREATE_CLIENT_REQUEST:
      return {
        ...state,
        clientCreate: {
          loading: true,
          success: false,
          error: null,
        },
      };
    case CREATE_CLIENT_SUCCESS:
      return {
        ...state,
        client: action.payload,
        clientCreate: {
          loading: false,
          success: true,
          error: null,
        },
      };
    case CREATE_CLIENT_FAILURE:
      return {
        ...state,
        clientCreate: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    // Obtener todos los clientes
    case GET_ALL_CLIENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_CLIENT_SUCCESS:
      return {
        ...state,
        clients: action.payload, // Lista de clientes
        loading: false,
        error: null,
      };
    case GET_ALL_CLIENT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_CLIENT_REQUEST:
    case UPDATE_CLIENT_REQUEST:
    case DELETE_CLIENT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_CLIENT_SUCCESS:
      return {
        ...state,
        client: action.payload, // Cliente cargado
        loading: false,
        error: null,
      };

    case UPDATE_CLIENT_SUCCESS:
      return {
        ...state,
        clients: state.clients.map((client) =>
          client.idClient === action.payload.idClient ? action.payload : client
        ),
        loading: false,
        error: null,
      };

    case DELETE_CLIENT_SUCCESS:
      return {
        ...state,
        clients: state.clients.filter(
          (client) => client.idClient !== action.payload
        ),
        loading: false,
        error: null,
      };

    case GET_CLIENT_FAILURE:
    case UPDATE_CLIENT_FAILURE:
    case DELETE_CLIENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_PROPERTY_REQUEST:
      return {
        ...state,
        propertyCreate: {
          loading: true,
          success: false,
          error: null,
        },
      };
    case CREATE_PROPERTY_SUCCESS:
      return {
        ...state,
        properties: [...state.properties, action.payload],
        propertyCreate: {
          loading: false,
          success: true,
          error: null,
        },
      };
    case CREATE_PROPERTY_FAILURE:
      return {
        ...state,
        propertyCreate: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    case RESET_CREATE_PROPERTY_STATE:
      return {
        ...state,
        propertyCreate: {
          loading: false,
          success: false,
          error: null,
        },
      };
    case ADD_PROPERTY_TO_CLIENT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ADD_PROPERTY_TO_CLIENT_SUCCESS:
      console.log('Propiedad agregada al cliente:', action.payload);
      return {
        ...state,
        loading: false,
        propertyClientData: action.payload, // Almacena los datos que regresan de la API
      };
    case ADD_PROPERTY_TO_CLIENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CREATE_LEASE_REQUEST:
      return {
        ...state,
        leaseCreate: {
          loading: true,
          success: false,
          error: null,
        },
      };

    case CREATE_LEASE_SUCCESS:
      return {
        ...state,
        leases: [...state.leases, action.payload],
        leasesCreate: {
          loading: false,
          success: true,
          error: null,
        },
      };
    case CREATE_LEASE_FAILURE:
      return {
        ...state,
        leaseCreate: {
          loading: false,
          success: false,
          error: action.payload,
        },
      };
    case GET_PROPERTIES_BY_CLIENT_REQUEST:
    case GET_PROPERTIES_BY_TYPE_REQUEST:
    case UPDATE_PROPERTY_REQUEST:
    case DELETE_PROPERTY_REQUEST:
    case GET_FILTERED_PROPERTIES_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_PROPERTIES_BY_CLIENT_SUCCESS:
      return { ...state, loading: false, properties: action.payload };

    case GET_PROPERTIES_BY_TYPE_SUCCESS:
      return { ...state, loading: false, properties: action.payload };

    case UPDATE_PROPERTY_SUCCESS:
      return {
        ...state,
        loading: false,
        properties: state.properties.map((property) =>
          property.propertyId === action.payload.propertyId
            ? { ...property, ...action.payload }
            : property
        ),
      };

    case DELETE_PROPERTY_SUCCESS:
      return {
        ...state,
        loading: false,
        properties: state.properties.filter(
          (property) => property.propertyId !== action.payload.propertyId
        ),
      };

    case GET_FILTERED_PROPERTIES_SUCCESS:
      return { ...state, loading: false, filteredProperties: action.payload };

    case GET_PROPERTIES_BY_CLIENT_FAILURE:
    case GET_PROPERTIES_BY_TYPE_FAILURE:
    case UPDATE_PROPERTY_FAILURE:
    case DELETE_PROPERTY_FAILURE:
    case GET_FILTERED_PROPERTIES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default rootReducer;
