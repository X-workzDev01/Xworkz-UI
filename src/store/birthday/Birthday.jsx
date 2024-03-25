import { createSlice } from '@reduxjs/toolkit';

const BirthdayStatus = createSlice({
    name: 'birthday',
    initialState: {
        date: 'null',
        batchName: 'null',
        month: 'null',
    },
    reducers: {
        savebirthdayMonth: (state, action) => {
            state.month = action.payload;
        },
        savebirthdayDate: (state, action) => {
            state.date = action.payload;
        },
        saveBatchName: (state, action) => {
            state.batchName = action.payload;
        },
    },
});
export const {
    savebirthdayDate,
    savebirthdayMonth,
    saveBatchName,
} = BirthdayStatus.actions;
export default BirthdayStatus.reducer;
