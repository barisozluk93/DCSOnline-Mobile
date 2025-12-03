const initialState = {
  user: null,
  authorizedFirms: null,
  selectedAuthorizedFirm: null,
  loading: false,
  error: null,
};


export default function userReducer(state = initialState, action) {
  switch (action.type) {

    case 'USER_GET_REQUEST':
      return { ...state, loading: true, error: null };


    case 'USER_GET_SUCCESS':
      return {
        ...state,
        loading: false,
        user: action.payload,
      };


    case 'USER_GET_FAIL':
      return { ...state, loading: false, error: action.payload };


    case 'USER_AUTH_FIRMS_GET_REQUEST':
      return { ...state, loading: true, error: null };


    case 'AUTH_FIRMS_GET_SUCCESS':
      return {
        ...state,
        loading: false,
        authorizedFirms: action.payload,
      };


    case 'AUTH_FIRMS_GET_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'SET_SELECTED_AUTH_FIRM':
      return {
        ...state,
        loading: false,
        selectedAuthorizedFirm: action.payload,
      };

    case 'USER_INIT':
      return initialState;

    default:
      return state;
  }
}