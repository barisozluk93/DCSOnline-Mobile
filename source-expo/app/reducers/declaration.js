const initialState = {
  declarations: null,
  page: null,
  pageSize: null,
  totalPages: null,
  loading: false,
  error: null,
};


export default function declarationReducer(state = initialState, action) {
  switch (action.type) {

    case 'DECLARATION_LIST_REQUEST':
      return { ...state, loading: true, error: null };


    case 'DECLARATION_LIST_SUCCESS':
      return {
        ...state,
        loading: false,
        declarations: action.payload.data,
        page: action.payload.page,
        pageSize: action.payload.pageSize,
        totalPages: action.payload.totalPages,
      };

    case 'DECLARATION_LIST_FAIL':
      return { ...state, loading: false, error: action.payload };
    
    case 'DECLARATION_INIT':
      return initialState;

    default:
      return state;
  }
}