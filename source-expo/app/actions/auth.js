import { getUserRequest } from '@/apis/userApi';
import { loginRequest } from '@/apis/authApi';
import { saveToken, loadToken, removeToken } from '@/utils/storage';

export const initAuth = () => async (dispatch) => {
  const token = await loadToken();
  dispatch({ type: 'AUTH_INIT', payload: token });

  if (token) {
    try {
      const user = await getUserRequest();
      dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: { user, token } });
    } catch (e) {
      await removeToken();
    }
  }
};

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: 'AUTH_LOGIN_REQUEST' });
    const data = await loginRequest(username, password);
    await saveToken(data);


    dispatch({ type: 'AUTH_LOGIN_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'AUTH_LOGIN_FAIL', payload: error.response?.data?.message || error.message });
  }
};

export const logout = () => async (dispatch) => {
  await removeToken();
  dispatch({ type: 'AUTH_LOGOUT' });
};