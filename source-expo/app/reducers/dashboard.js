const today = new Date();
const yıl = today.getFullYear();
const ay = String(today.getMonth()+1).padStart(2, '0');
const gun = String(today.getDay()+1).padStart(2, '0');

const initialState = {
  filter: { 
    vf_Yıl: new Date().getFullYear(),
    vf_RegisterationStartDate: "2025-01-01",
    vf_RegisterationEndDate: yıl + "-" + ay + "-" + gun,
    vf_ApplicationStartDate: "2025-02-01",
    vf_ApplicationEndDate: yıl + "-" + ay + "-" + gun,
  }, 
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