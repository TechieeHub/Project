import { Box } from '@mui/material'
import React from 'react'
import VisualizationComponent from './VisualizationComponent'
import AnomalieComponent from './AnomalieComponent'
import ChartComponent from './ChartComponent'

const ChartData = () => {
  return (
    <Box sx={{display:'flex', gap:'10px', marginTop:'10px', marginLeft:'5px', marginRight:'5px'}}>
      <VisualizationComponent/>
      <AnomalieComponent/>
      {/* <ChartComponent/>       */}
    </Box>
  )
}

export default ChartData
