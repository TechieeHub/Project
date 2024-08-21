import { Box } from '@mui/material'
import React from 'react'
import VisualizationComponent from './VisualizationComponent'
import AnomalieComponent from './AnomalieComponent'
import ChartComponent from './ChartComponent'
import { useSelector } from 'react-redux';

const ChartData = () => {
  const excelData = useSelector((state) => state.excel.data);

  console.log('excelData',excelData)
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
