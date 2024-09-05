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
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setChartDisplayData } from "../../Store/excelSlice";

const VisualizationComponent = ({ onView }) => {
  const dispatch = useDispatch();
  // const excelData = useSelector((state) => state.excel.data)?.filter(
  //   (data) => data.is_deleted !== true
  // );


  const excelData = JSON.parse(localStorage.getItem("filteredData")) || [];

  console.log('excelDataiuyiy',excelData)


  const largeRunViewHandler = () => {
    const data = excelData.filter((data) => data.AccountRefresh === "Large run");
    dispatch(setChartDisplayData(data));
    onView(data); // Pass filtered data to parent component
  };

  const quickRunViewHandler = () => {
    const data = excelData.filter((data) => data.AccountRefresh === "Quick run");
    dispatch(setChartDisplayData(data));
    onView(data); // Pass filtered data to parent component
  };

  return (
    <TableContainer component={Paper}>
      <Typography sx={{ fontSize: "25px", fontWeight: 600, backgroundColor: "grey" }}>
        <Box sx={{ marginLeft: "15px" }}>Account Monitored</Box>
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "17px", fontWeight: 550 }}>
              <Typography sx={{ fontSize: '20px', fontWeight: 550 }}>
                Total MDM IDs
              </Typography>
            </TableCell>
            <TableCell sx={{ fontSize: '20px' }}>{excelData?.length}</TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button
                key={'Add/ModifyAccountId'}
                component={Link}
                to={"/"}
                sx={{
                  my: 2,
                  display: 'block',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'underline',
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
            <TableCell><Typography sx={{ fontSize: '20px' }}>Large run</Typography></TableCell>
            <TableCell>
              <Typography sx={{ fontSize: '20px' }}>
                {excelData?.filter((data) => data.AccountRefresh === "Large run")?.length}
              </Typography>
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button
                key={'largeRunView'}
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
                View
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography sx={{ fontSize: '20px' }}>
                Quick run
              </Typography>
            </TableCell>
            <TableCell>
              <Typography sx={{ fontSize: '20px' }}>
                {excelData?.filter((data) => data.AccountRefresh === "Quick run")?.length}
              </Typography>
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button
                key={'quickRunView'}
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
                View
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VisualizationComponent;
