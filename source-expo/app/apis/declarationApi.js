import api from './axiosClient';

export const listDeclarationRequest = async (musteriid, page, pageSize) => {
  let data = {
    musteriid: musteriid,
    page: page,
    pageSize: pageSize,
    filters: [],
    orderBy: "tesciltarihi",
    orderDir: "desc"
  }

  const response = await api.post("/declaration/list", data);
  return response.data;
};

export const listDeclarationYYSRequest = async (musteriid) => {
  const response = await api.get("/declaration/unapproved-yys?musteriid=" + musteriid);
  return response;
};

export const listDeclarationArchieveRequest = async (declarationid) => {
  const response = await api.get(`/declaration/${declarationid}/archives`);
  return response.data;
};

export const getDeclarationPDF = async (declarationid, archiveid) => {
  const response = await api.post(`/declaration/${declarationid}/archives/download`, {
    arsivIds: [archiveid]
  });
  return response.data;
};

