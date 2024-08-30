import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";



const AnomalieComponent = () => {
  const excelData = useSelector((state) => state.excel.filteredData)?.filter(
    (data) => data.is_deleted !== true
  );

  const anamolyValue = useSelector((state) => state.excel.anomalyValue);
  


  console.log('lkjncxkja',excelData)
  return (
    <TableContainer component={Paper}>
      <Typography sx={{ fontSize: "25px", fontWeight:600 , backgroundColor:'grey'}}>
      <Box sx={{marginLeft:'15px'}}>
      Anomalies
        </Box>
        
        </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "20px" ,fontWeight:600}}>
            Count in latest run</TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            <TableCell >
            <Typography sx={{fontSize:'20px', fontWeight:550}}>
              
              No anomalies
              </Typography>
              </TableCell>
            <TableCell>
            <Typography sx={{fontSize:'20px'}}>
              {excelData.length-((excelData?.filter(data=>data?.Anomaly.includes(anamolyValue))
            
            ?.length)+excelData?.filter(data=>(!data?.Anomaly.includes('10%') && data.Anomaly!==''))?.length)}
              </Typography>
              </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>



          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
            <Typography sx={{fontSize:'20px'}}>
            EOD balance more than 5 day average end of day balance by {anamolyValue}%
            </Typography>
            </TableCell>
            <TableCell>
            <Typography sx={{fontSize:'20px'}}>
            {excelData?.filter(data=>data?.Anomaly.includes(anamolyValue))
            
            ?.length}</Typography></TableCell>
            <TableCell></TableCell>
            <TableCell>
            <Button
                key={'eodBalanceMoreThen5days'}
                // component={Link}  
                // to={"/"}   
                sx={{
                  my: 2,
                  display: 'block',
                  textDecoration: 'underline', 
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
            <Typography sx={{fontSize:'20px'}}>
            EOD Balance less than 5 day average end of day balance</Typography></TableCell>
            <TableCell>
            <Typography sx={{fontSize:'20px'}}>
              
              {excelData?.filter(data=>(!data?.Anomaly.includes('10%') && data.Anomaly!==''))?.length}
              </Typography></TableCell>
            <TableCell></TableCell>
            <TableCell>
            <Button
                key={'eodBalanceLessThen5days'}
                // component={Link}  
                // to={"/"}   
                sx={{
                  my: 2,
                  display: 'block',
                  textDecoration: 'underline', 
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                View
              </Button>
              
              
                         </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnomalieComponent;

