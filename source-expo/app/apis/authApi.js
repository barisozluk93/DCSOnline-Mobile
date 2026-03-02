import authApi from './authAxiosClient';
import api from './axiosClient';

const client_id = "mobile-app-client";

export const loginRequest = async (username, password) => {
  var params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("client_id", client_id);
  params.append("username", username);
  params.append("password", password);

  const response = await authApi.post("realms/dcs-portal/protocol/openid-connect/token/", params, {
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      }});

  return response.data;
};

export const refreshTokenRequest = async (refreshToken) => {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", client_id);
  params.append("refresh_token", refreshToken);

  const response = await authApi.post("realms/dcs-portal/protocol/openid-connect/token/", params, {
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      }});

  return response.data;
};