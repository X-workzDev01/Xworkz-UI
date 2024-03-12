import {createSlice} from '@reduxjs/toolkit';

const Attendence = createSlice ({
  name: 'attendanceCourseName',
  initialState: {
    attendanceCourseName: null,
  },
  reducers: {
    saveAttendanceCourseName: (state, action) => {
      state.attendanceCourseName = action.payload;
    },
  },
});
export const {saveAttendanceCourseName} = Attendence.actions;
export default Attendence.reducer;
