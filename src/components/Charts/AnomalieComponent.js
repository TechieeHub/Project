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
  const excelData = useSelector((state) => state.excel.data)?.filter(
    (data) => data.is_deleted !== true
  );


  console.log('lkjncxkja',excelData?.map(data=>data?.Deviation_5Day_Today))
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
            
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "17px" ,fontWeight:550}}>No anomalies</TableCell>
            <TableCell>{excelData?.map(data=>data?.Deviation_5Day_Today).length}</TableCell>


          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>EOD balance more than 5 day average end of day balance by 10%</TableCell>
            <TableCell>{excelData?.filter(data=>data?.Deviation_5Day_Today>0)?.length}</TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button  variant="contained"
              sx={{
                backgroundColor: "grey",
              }}>
                View
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>EOD Balance less than 5 day average end of day balance</TableCell>
            <TableCell>{excelData?.filter(data=>data?.Deviation_5Day_Today<=0)?.length}</TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button  variant="contained"
              sx={{
                backgroundColor: "grey",
              }}>
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

