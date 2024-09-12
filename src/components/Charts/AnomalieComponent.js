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
import { useSelector } from "react-redux";
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const AnomalieComponent = ({ onView, onChartTitleChange ,data}) => {
  // const excelData = JSON.parse(localStorage.getItem("filteredData")) || [];

  const excelData=data;
  const anomalyValue = useSelector((state) => state.excel.anomalyValue);

  const handleViewMoreThan5DayAvg = () => {
    const filteredData = excelData.filter((data) =>
      data?.Anomaly.includes(anomalyValue)
    );
    onView(filteredData);
    onChartTitleChange(`EOD more than 5 day average end of day balance by ${anomalyValue}%`);
  };

  const handleViewLessThan5DayAvg = () => {
    const filteredData = excelData.filter(
      (data) => !data?.Anomaly.includes(anomalyValue) && data.Anomaly !== ""
    );
    onView(filteredData);
    onChartTitleChange("EOD less than 5 day average end of day balance");
  };

  return (
    <TableContainer component={Paper} sx={{ height: '100%', fontFamily: 'Roboto' }}>
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
          fontFamily: 'Roboto',
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
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                  EOD more than <strong>5 day</strong> average end of day balance by <Typography sx={{ fontWeight: "550", fontSize: "20px" }}>{anomalyValue}%</Typography>
                </Typography>
                <Tooltip title="Anomaly information for values more than 5 day average">
                  <InfoOutlinedIcon sx={{ marginLeft: '8px', fontSize: '20px', cursor: 'pointer' }} />
                </Tooltip>
              </div>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                {excelData?.filter((data) => data?.Anomaly.includes(anomalyValue))?.length}
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
                EOD less than <strong>5 day</strong> average end of day balance
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                {excelData?.filter((data) => !data?.Anomaly.includes(anomalyValue) && data.Anomaly !== "")?.length}
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
