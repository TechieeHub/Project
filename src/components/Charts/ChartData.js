import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import VisualizationComponent from './VisualizationComponent'
import AnomalieComponent from './AnomalieComponent'
import ChartComponent from './ChartComponent'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { setTableData } from '../../Store/excelSlice'

const ChartData = () => {

  const dispatch=useDispatch()
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        dispatch(setTableData(response.data.records));
      })
      .catch((error) => console.log("error", error));
  }, []);
  return (
    <Box>
    <Box sx={{display:'flex', gap:'10px', marginTop:'10px', marginLeft:'5px', marginRight:'5px'}}>
      <VisualizationComponent/>
      <AnomalieComponent/>
    </Box>
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
      <ChartComponent/>      

    </Box>
    </Box>
  )
}

export default ChartData
