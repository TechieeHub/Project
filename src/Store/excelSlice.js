import { createSlice } from '@reduxjs/toolkit';

const excelSlice = createSlice({
  name: 'excel',
  initialState: {
    data: [],
  },
  reducers: {
    setTableData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setTableData } = excelSlice.actions;
export default excelSlice.reducer;
