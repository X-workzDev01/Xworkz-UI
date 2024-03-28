import { createSlice } from '@reduxjs/toolkit';

const FollowUpStatus = createSlice({
  name: 'followUpdropDown',
  initialState: {
    followUpStatus: 'null',
    followUpCourseName: 'null',
    followUpCollegename: 'null',
    followUpCallBackDate: 'null',
    followUpUpdatedDate: 'null',
    followUpSelectedColumns: ['traineeName', 'email', 'contactNumber', 'registrationDate', 'currentStatus', 'courseName', 'joiningDate', 'actions'],
    yearOfPass: 'null',
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
    saveFollowUpUpdateDate: (state, action) => {
      state.followUpUpdatedDate = action.payload;
    },
    saveFollowUpSelectedColumns: (state, action) => {
      state.followUpSelectedColumns = action.payload;
     }
    saveYearOfPass: (state, action) => {
      state.yearOfPass = action.payload;
    },

  },
});
export const {
  saveFollowUpstatus,
  saveFollowUpCourseName,
  saveFollowUpCollegeName,
  saveFollowUpCallBackDate,
  saveFollowUpSelectedColumns,
  saveYearOfPass,
} = FollowUpStatus.actions;
export default FollowUpStatus.reducer;
