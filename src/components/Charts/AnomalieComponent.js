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
} from "@mui/material";

const AnomalieComponent = () => {
  return (
    <TableContainer component={Paper}>
      <Typography sx={{ fontSize: "25px", fontWeight:600 , backgroundColor:'grey'}}>Anomalies</Typography>

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
            <TableCell>6</TableCell>


          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>EOD balance more than 5 day average end of day balance by 10%</TableCell>
            <TableCell>3</TableCell>
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
            <TableCell>3</TableCell>
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

