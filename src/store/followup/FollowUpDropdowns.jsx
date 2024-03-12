import {createSlice} from '@reduxjs/toolkit';

const FollowUpStatus = createSlice ({
  name: 'followUpdropDown',
  initialState: {
    followUpStatus: 'null',
    followUpCourseName: 'null',
    followUpCollegename: 'null',
    followUpCallBackDate: 'null',
  },
  reducers: {
    saveFollowUpstatus: (state, action) => {
      state.followUpStatus = action.payload;
    },
    saveFollowUpCourseName: (state, action) => {
      state.followUpCourseName = action.payload;
    },
    saveFollowUpCollegeName: (state, action) => {
      state.followUpCollegename = action.payload;
    },
    saveFollowUpCallBackDate: (state, action) => {
      state.followUpCallBackDate = action.payload;
    },
  },
});
export const {
  saveFollowUpstatus,
  saveFollowUpCourseName,
  saveFollowUpCollegeName,
  saveFollowUpCallBackDate,
} = FollowUpStatus.actions;
export default FollowUpStatus.reducer;
