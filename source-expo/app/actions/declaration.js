import { listDeclarationRequest, listDeclarationYYSRequest } from "@/apis/declarationApi";


export const listDeclaration = (musteriid, page, pageSize) => async (dispatch) => {
  try {
    dispatch({ type: 'DECLARATION_LIST_REQUEST' });
    const data = await listDeclarationRequest(musteriid, page, pageSize);
    dispatch({ type: 'DECLARATION_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'DECLARATION_LIST_FAIL', payload: error.response?.data?.message || error.message });
  }
};

export const listDeclarationYYS = (musteriid) => async (dispatch) => {
  try {
    dispatch({ type: 'DECLARATION_YYS_LIST_REQUEST' });
    const data = await listDeclarationYYSRequest(musteriid);
    dispatch({ type: 'DECLARATION_YYS_LIST_SUCCESS', payload: data });
  } catch (error) {
    dispatch({ type: 'DECLARATION_YYS_LIST_FAIL', payload: error.response?.data?.message || error.message });
  }
};