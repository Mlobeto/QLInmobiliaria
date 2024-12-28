import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  CREATE_CONTACT_SUCCESS,
  CREATE_CONTACT_FAIL,
  GET_ALL_CONTACTS_SUCCESS,
  GET_ALL_CONTACTS_FAIL
 
} from "../Actions/actions-types";

const initialState = {
  adminInfo: null,
  token: null,
  contacts: [],
  contact: null,
  
  loading: false,
  error: null,
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

    case CREATE_CONTACT_SUCCESS:
      return {
        ...state,
        contact: action.payload.contact,
        error: null,
      };
    case GET_ALL_CONTACTS_SUCCESS:
      return {
        ...state,
        contacts: action.payload,
        error: null,
      };
    case CREATE_CONTACT_FAIL:
    case GET_ALL_CONTACTS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    

    default:
      return state;
  }
};
export default rootReducer;