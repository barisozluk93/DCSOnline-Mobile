import api from './axiosClient';

export const getUserRequest = async () => {
  const response = await api.get("/user/me");
  return response.data;
};

export const getUserAuthorizedFirmsRequest = async () => {
  const response = await api.get("/user/authorized-companies");
  return response.data;
};