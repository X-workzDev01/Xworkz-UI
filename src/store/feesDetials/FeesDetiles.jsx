import {createSlice} from '@reduxjs/toolkit';

const FeesStatus = createSlice ({
  name: 'feesDropDown',
  initialState: {
    feesStatus: 'null',
    paymentMode: 'null',
    batchName: 'null',
    callBackDate: 'null',
  },
  reducers: {
    saveFeesStatus: (state, action) => {
      state.feesStatus = action.payload;
    },
    savePaymentMode: (state, action) => {
      state.paymentMode = action.payload;
    },
    saveFeesBatchName: (state, action) => {
      state.batchName = action.payload;
    },
    saveCallbackDate: (state, action) => {
      state.callBackDate = action.payload;
    },
  },
});
export const {
  saveFeesStatus,
  savePaymentMode,
  saveFeesBatchName,
  saveCallbackDate,
} = FeesStatus.actions;
export default FeesStatus.reducer;
