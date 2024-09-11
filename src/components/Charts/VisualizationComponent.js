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
import { useDispatch } from "react-redux";
import { setChartDisplayData } from "../../Store/excelSlice";
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const VisualizationComponent = ({ onView, onChartTitleChange }) => {
  const dispatch = useDispatch();
  const excelData = JSON.parse(localStorage.getItem("filteredData")) || [];

  const largeRunViewHandler = () => {
    const data = excelData.filter((data) => data.AccountRefresh === "Large run");
    dispatch(setChartDisplayData(data));
    onView(data);
    onChartTitleChange("Large Run"); // Update the chart title
  };

  const quickRunViewHandler = () => {
    const data = excelData.filter((data) => data.AccountRefresh === "Quick run");
    dispatch(setChartDisplayData(data));
    onView(data);
    onChartTitleChange("Quick Run"); // Update the chart title
  };

  return (
    <TableContainer component={Paper} sx={{ height: '100%' }}>
      <Typography sx={{ fontSize: "25px", fontWeight: 600, backgroundColor: "grey", color: "white", fontFamily: 'Roboto' }}>
        <Box sx={{ marginLeft: "15px", padding: "0.5rem", fontFamily: 'Roboto' }}>Account Monitored</Box>
      </Typography>
      <Table sx={{ "& .MuiTableRow-root": { height: "80px", fontFamily: 'Roboto' } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "17px", fontWeight: 550 }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 550 }}>
                Total Accounts
              </Typography>
            </TableCell>
            <TableCell sx={{ fontSize: '20px' }}>{excelData?.length}</TableCell>
            <TableCell>
              <Button
                sx={{
                  my: 2,
                  display: 'block',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
              >
                Add/Modify Account ID
              </Button>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '20px', fontFamily: 'Roboto' }}>
                  Large run
                </Typography>
                <Tooltip title="Large run means this and this...">
                  <InfoOutlinedIcon sx={{ marginLeft: '8px', fontSize: '20px', cursor: 'pointer' }} />
                </Tooltip>
              </div>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: '20px' }}>
                {excelData?.filter((data) => data.AccountRefresh === "Large run")?.length}
              </Typography>
            </TableCell>
            <TableCell>
              <Button
                sx={{
                  my: 2,
                  display: 'block',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={largeRunViewHandler}
              >
                <BarChartIcon />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '20px', fontFamily: 'Roboto' }}>
                  Quick run
                </Typography>
                <Tooltip title="Quick run means this and this...">
                  <InfoOutlinedIcon sx={{ marginLeft: '8px', fontSize: '20px', cursor: 'pointer' }} />
                </Tooltip>
              </div>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: '20px' }}>
                {excelData?.filter((data) => data.AccountRefresh === "Quick run")?.length}
              </Typography>
            </TableCell>
            <TableCell>
              <Button
                sx={{
                  my: 2,
                  display: 'block',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={quickRunViewHandler}
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

export default VisualizationComponent;
