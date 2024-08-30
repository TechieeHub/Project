import { createSlice } from '@reduxjs/toolkit';

const excelSlice = createSlice({
  name: 'excel',
  initialState: {
    data: [],
    filteredData: [],
    chartDisplayData:[],
    anomalyValue:''
  },
  reducers: {
    setTableData: (state, action) => {
      state.data = action.payload;
    },
    setFilteredData: (state, action) => {
      state.filteredData = action.payload;
    },
    setChartDisplayData: (state, action) => {
      state.chartDisplayData = action.payload;
    },
    setAnomalyValue: (state, action) => {
      state.anomalyValue = action.payload;
    },
  },
});

export const { setTableData,setFilteredData,setChartDisplayData,setAnomalyValue } = excelSlice.actions;
export default excelSlice.reducer;
