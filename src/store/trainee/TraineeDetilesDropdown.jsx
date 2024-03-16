import {createSlice} from '@reduxjs/toolkit';

const TraineeDetilesDropdown = createSlice ({
  name: 'traineeDropdown',
  initialState: {
    courseName: 'null',
    collegeName: 'null',
    followUpstatus: 'null',
  },
  reducers: {
    saveCourse: (state, action) => {
      state.courseName = action.payload;
    },
    saveCollegeName: (state, action) => {
      state.collegeName = action.payload;
    },
    saveFollowUpStatus: (state, action) => {
      state.followUpstatus = action.payload;
    },
  },
});

export const {
  saveCourse,
  saveCollegeName,
  saveFollowUpStatus,
} = TraineeDetilesDropdown.actions;
export default TraineeDetilesDropdown.reducer;
