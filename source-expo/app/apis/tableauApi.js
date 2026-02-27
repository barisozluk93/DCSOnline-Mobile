import tableauApi from './tableauAxiosClient';

export const tableauGetDataRequest = async (siteId, viewId, filter, token, signal) => {
  try {
      const response = await tableauApi.get(`sites/${siteId}/views/${viewId}/data`, {
        headers: {
          "X-Tableau-Auth": token
        },
        params: filter,
        signal
      });

      return response.data;
  }
  catch (error) {
    if (error.response) {
      // Server cevap verdi ama status error (4xx / 5xx)
      console.error("Tableau API Error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Request atıldı ama cevap gelmedi
      console.error("No response from Tableau API:", error.request);
    } else {
      // İstek hazırlanırken hata
      console.error("Request setup error:", error.message);
    }

    throw error; // yukarıya da fırlatmak istersen
  }
};