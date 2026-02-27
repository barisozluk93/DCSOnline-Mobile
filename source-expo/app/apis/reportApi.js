import api from './axiosClient';

export const getRequestIdRequest = async (musteriid) => {
  const response = await api.post("/reports/createrequest", { 
    musteriid: musteriid, applicationName:"DCS Mobile" 
  });
  
  return response.data;
};

export const tableauLoginRequest = async () => {
  const response = await api.post("/tableau/signin");
  
  return response.data;
};

