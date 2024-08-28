import { createSlice } from '@reduxjs/toolkit';

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    excelData: [],
    deletedColumns: [],
  },
  reducers: {
    setExcelData(state, action) {
      state.excelData = action.payload;
    },
    setDeletedColumns(state, action) {
      state.deletedColumns = action.payload;
    },
    addDeletedColumn(state, action) {
      state.deletedColumns.push(action.payload);
    },
    removeDeletedColumn(state, action) {
      state.deletedColumns = state.deletedColumns.filter(column => column !== action.payload);
    },
  },
});

export const { setExcelData, setDeletedColumns, addDeletedColumn, removeDeletedColumn } = dataSlice.actions;
export default dataSlice.reducer;
