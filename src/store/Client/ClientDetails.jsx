import { createSlice } from '@reduxjs/toolkit';

const ClientDetails = createSlice({
    name: 'clientDetails',
    initialState: {
        searchValue: '',
        clientType: "null",
        callBackDate: "null",
    },
    reducers: {
        saveSearchValue: (state, action) => {
            state.searchValue = action.payload;
        },
        saveClientType: (state, action) => {
            state.clientType = action.payload;
        },
        saveCallBackDate: (state, action) => {
            state.callBackDate = action.payload;
        },
    },
});

export const {
    saveSearchValue,
    saveClientType,
    saveCallBackDate,
} = ClientDetails.actions;
export default ClientDetails.reducer;
