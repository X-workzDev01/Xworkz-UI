import {createSlice} from '@reduxjs/toolkit';

const Attendence = createSlice ({
  name: 'attendanceCourseName',
  initialState: {
    attendanceCourseName: null,
    search: null,
  },
  reducers: {
    saveAttendanceCourseName: (state, action) => {
      state.attendanceCourseName = action.payload;
    },
    saveSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});
export const {saveAttendanceCourseName, saveSearch} = Attendence.actions;
export default Attendence.reducer;
