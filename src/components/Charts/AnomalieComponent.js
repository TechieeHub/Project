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
  const anomalyValue = JSON.parse(localStorage.getItem("anomalyValue")) || [];

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
    <TableContainer component={Paper} sx={{ height: '100%' }}>
      <Typography
        sx={{ fontSize: "25px", fontWeight: 600, backgroundColor: "grey", color: "white" }}
      >
        <Box sx={{ marginLeft: "15px", padding: "0.5rem" }}>Anomalies</Box>
      </Typography>

      <Table sx={{ "& .MuiTableRow-root": { height: "80px" } }}>
        <TableHead>
        <TableRow sx={{ height: "20px" }}>
  <TableCell sx={{ height: "70px" }}> {/* Ensures cell height matches */}
    <Typography sx={{ fontSize: "20px", height: "20px", display: "flex", alignItems: "center" }}> {/* Vertically aligns content */}
      Accounts with no anomalies
    </Typography>
  </TableCell>
  <TableCell sx={{ height: "40px" }}> {/* Ensures cell height matches */}
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
              <Typography sx={{ fontSize: "20px" }}>
                EOD balance more than 5 day average end of day balance by {anomalyValue}%
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "20px" }}>
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
              <Typography sx={{ fontSize: "20px" }}>
                EOD Balance less than 5 day average end of day balance
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "20px" }}>
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
