import {createSlice} from '@reduxjs/toolkit';

const LoginEmail = createSlice ({
  name: 'login',
  initialState: {
    email: null,
  },
  reducers: {
    saveLoginEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const {saveLoginEmail} = LoginEmail.actions;
export default LoginEmail.reducer;
