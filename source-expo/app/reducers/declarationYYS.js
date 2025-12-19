const initialState = {
  declarations: null,
  loading: false,
  error: null,
};


export default function declarationYYSReducer(state = initialState, action) {
  switch (action.type) {

    case 'DECLARATION_YYS_LIST_REQUEST':
      return { ...state, loading: true, error: null };


    case 'DECLARATION_YYS_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        declarations: action.payload,
      };

    case 'DECLARATION_YYS_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };
    
    case 'DECLARATION_YYS_INIT':
      return initialState;

    default:
      return state;
  }
}