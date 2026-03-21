import api from './axiosClient';

export const getMenuRequest = async (musteriid) => {
  console.log("musteriid" + musteriid)
  const params = new URLSearchParams();
  params.append("musteriid", musteriid);
  params.append("locale", "tr");

  const response = await api.get("/menu/", { params });
  return response.data;
};