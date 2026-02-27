const initialState = {
  filter: { vf_Yıl: new Date().getFullYear() }, 
  error: null,
};


export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    
    case 'DASHBOARD_SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };

    case 'DASHBOARD_INIT':
      return initialState;

    default:
      return state;
  }
}