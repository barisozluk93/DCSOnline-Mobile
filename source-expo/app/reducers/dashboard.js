const today = new Date();
const yıl = today.getFullYear();
const ay = String(today.getMonth()+1).padStart(2, '0');
const gun = String(today.getDate()).padStart(2, '0');

const initialState = {
  filter: null, 
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