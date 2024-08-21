// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import excelReducer from '../Store/excelSlice';

const store = configureStore({
  reducer: {
    excel: excelReducer,
  },
});

export default store;
