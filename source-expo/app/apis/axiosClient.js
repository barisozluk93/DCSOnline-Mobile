import axios from 'axios';
import { loadRefreshToken, loadToken, removeToken, saveToken } from '../utils/storage';
import { refreshTokenRequest } from './authApi';
import * as rootNavigation from '.././navigation/rootNavigation';

const api = axios.create({
  baseURL: 'https://dev-dcs-online.dcscustoms.com.tr/api',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(async (config) => {
  const token = await loadToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Token süresi dolmuş → 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Başka bir refresh isteği varsa kuyruğa ekle
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }


      isRefreshing = true;

      try {
        const refreshToken = await loadRefreshToken();
        console.log("Refresh Token : " + refreshToken);
        if (!refreshToken) {
          console.log("No refresh Token");
          throw new Error("No refresh token");
        }

        // Refresh isteği
        const authResponse = await refreshTokenRequest(refreshToken);
        await saveToken(authResponse);
        api.defaults.headers.Authorization = "Bearer " + authResponse.access_token;
        processQueue(null, authResponse.access_token);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        await removeToken();
        rootNavigation.navigate('SignIn');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;