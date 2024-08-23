import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import VisualizationComponent from './VisualizationComponent'
import AnomalieComponent from './AnomalieComponent'
import ChartComponent from './ChartComponent'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'
import { setTableData } from '../../Store/excelSlice'

const ChartData = () => {
  const [initialChartData,setInitialChartData]=useState(null)

  const dispatch=useDispatch()
  const excelData = useSelector((state) => state.excel.filteredData)?.filter(
    (data) => data.is_deleted !== true
  );
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        dispatch(setTableData(response.data.records));
        setInitialChartData(response.data.records)
      })
      .catch((error) => console.log("error", error));
  }, []);


  return (
    <Box>
    <Box sx={{display:'flex', gap:'10px', marginTop:'10px', marginLeft:'5px', marginRight:'5px'}}>
      <VisualizationComponent/>
      <AnomalieComponent/>
    </Box>
    <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', marginTop:'30px'}}>
      {initialChartData?.length>0 && 
      <ChartComponent data={excelData}/>      
}

    </Box>
    </Box>
  )
}

export default ChartData
