import { createSlice } from '@reduxjs/toolkit';

const excelSlice = createSlice({
  name: 'excel',
  initialState: {
    data: [],
    filteredData: [],
    chartDisplayData:[]
  },
  reducers: {
    setTableData: (state, action) => {
      state.data = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
    setChartDisplayData: (state, action) => {
      state.filteredData = action.payload;
    },
  },
});

export const { setTableData,setFilteredData,setChartDisplayData } = excelSlice.actions;
export default excelSlice.reducer;
