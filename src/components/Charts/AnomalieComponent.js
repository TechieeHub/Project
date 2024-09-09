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
import BarChartIcon from '@mui/icons-material/BarChart';
const AnomalieComponent = ({ onView }) => {
  const excelData = JSON.parse(localStorage.getItem("filteredData")) || [];
  const anomalyValue = JSON.parse(localStorage.getItem("anomalyDataValue")) || [];



  console.log('anomalyValue',anomalyValue)
  const handleViewMoreThan5DayAvg = () => {
    const filteredData = excelData.filter((data) =>
      data?.Anomaly.includes(anomalyValue)
    );
    onView(filteredData);
  };

  const handleViewLessThan5DayAvg = () => {
    const filteredData = excelData.filter(
      (data) => !data?.Anomaly.includes("10%") && data.Anomaly !== ""
    );
    onView(filteredData);
  };

  return (
    <TableContainer component={Paper} sx={{ height: '100%', fontFamily: 'Roboto' }}> {/* Set font to Roboto */}
      <Typography
        sx={{
          fontSize: "25px",
          fontWeight: 600,
          backgroundColor: "grey",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem",
          fontFamily: 'Roboto',  // Set Roboto for this Typography component
        }}
      >
        <Box sx={{ marginLeft: "15px", fontFamily: 'Roboto' }}>Anomalies</Box>

      </Typography>

      <Table sx={{ "& .MuiTableRow-root": { height: "80px", fontFamily: 'Roboto' } }}>
        <TableHead>
          <TableRow sx={{ height: "20px", fontFamily: 'Roboto' }}>
            <TableCell sx={{ height: "70px" }}>
              <Typography sx={{ fontSize: "20px", height: "20px", display: "flex", alignItems: "center", fontFamily: 'Roboto' }}>
                Accounts with no anomalies
              </Typography>
            </TableCell>
            <TableCell sx={{ height: "40px" }}>
              <Typography sx={{ fontSize: "20px", height: "40px", display: "flex", alignItems: "center" }}>
                {excelData.filter((item) => item.Anomaly === '')?.length}
              </Typography>
            </TableCell>
            <TableCell ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                EOD balance more than 5 day average end of day balance by <Typography sx={{ fontWeight: "550", fontSize:"20px" }}>{anomalyValue}% </Typography>
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                {
                  excelData?.filter((data) =>
                    data?.Anomaly.includes(anomalyValue)
                  )?.length
                }
              </Typography>
            </TableCell>
            <TableCell>
              <Button
                sx={{
                  my: 2,
                  display: "block",
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleViewMoreThan5DayAvg}
              >
                <BarChartIcon />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                EOD Balance less than 5 day average end of day balance
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                {
                  excelData?.filter(
                    (data) =>
                      !data?.Anomaly?.includes(anomalyValue) && data.Anomaly !== ""
                  )?.length
                }
              </Typography>
            </TableCell>
            <TableCell>
              <Button
                sx={{
                  my: 2,
                  display: "block",
                  textDecoration: "underline",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={handleViewLessThan5DayAvg}
              >
                <BarChartIcon />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AnomalieComponent;
