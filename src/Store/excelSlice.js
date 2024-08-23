import { createSlice } from '@reduxjs/toolkit';

const excelSlice = createSlice({
  name: 'excel',
  initialState: {
    data: [],
    filteredData: [],
  },
  reducers: {
    setTableData: (state, action) => {
      state.data = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
  },
});

export const { setTableData,setFilteredData } = excelSlice.actions;
export default excelSlice.reducer;
