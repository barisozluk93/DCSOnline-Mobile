import axios from 'axios';
import { loadToken } from '../utils/storage';


const authApi = axios.create({
  baseURL: 'https://dev-kc.singlewindow.io/auth/',
});

authApi.interceptors.request.use(async (config) => {
  const token = await loadToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authApi;