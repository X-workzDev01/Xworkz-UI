
export const SET_CLIENT_TYPE = 'SET_CLIENT_TYPE';
export const SET_SEARCH_VALUE = 'SET_SEARCH_VALUE';
export const SET_CALL_BACK_DATE = 'SET_CALL_BACK_DATE';

export const setClientType = (clientType) => ({
  type: SET_CLIENT_TYPE,
  payload: clientType,
});

export const setSearchValue = (searchValue) => ({
  type: SET_SEARCH_VALUE,
  payload: searchValue,
});

export const setCallBackDate = (callBackDate) => ({
  type: SET_CALL_BACK_DATE,
  payload: callBackDate,
});
