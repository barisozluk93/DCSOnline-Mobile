import { getUserAuthorizedFirmsRequest, getUserRequest } from '@/apis/userApi';


export const getUser = () => async (dispatch) => {
  try {
    dispatch({ type: 'USER_GET_REQUEST' });
    const user = await getUserRequest();
    dispatch({ type: 'USER_GET_SUCCESS', payload: user.data.user });
  } catch (error) {
    dispatch({ type: 'USER_GET_FAIL', payload: error.response?.data?.message || error.message });
  }
};

export const getUserAuthorizedFirms = () => async (dispatch) => {
  try{
    dispatch({ type: 'USER_AUTH_FIRMS_GET_REQUEST' });
    const authorizedFirms = await getUserAuthorizedFirmsRequest();
    dispatch({ type: 'AUTH_FIRMS_GET_SUCCESS', payload: authorizedFirms.data }); //authorizedFirms.data[0].musteriid
    dispatch({ type: 'SET_SELECTED_AUTH_FIRM', payload: "0CCD9311-FF0F-417B-81C1-F4A737633AAE" });
  } catch (error) {
    dispatch({ type: 'AUTH_FIRMS_GET_FAIL', payload: error.response?.data?.message || error.message });
  }
};