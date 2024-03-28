import { createSlice } from '@reduxjs/toolkit';

const TraineeDetilesDropdown = createSlice({
  name: 'traineeDropdown',
  initialState: {
    courseName: 'null',
    collegeName: 'null',
    followUpstatus: 'null',
    offeredAs: 'null',
    yearOfPassOut: 'null',
    searchValue: '',
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
    saveOfferedAs: (state, action) => {
      state.offeredAs = action.payload;
    },
    saveYearOfPassOut: (state, action) => {
      state.yearOfPassOut = action.payload;
    },
    saveSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});

export const {
  saveCourse,
  saveCollegeName,
  saveFollowUpStatus,
  saveOfferedAs,
  saveYearOfPassOut,
  saveSearchValue,
} = TraineeDetilesDropdown.actions;
export default TraineeDetilesDropdown.reducer;
