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

const VisualizationComponent = () => {
  
  const excelData = useSelector((state) => state.excel.data)?.filter(data=>data.is_deleted!==true);

  // const quickRunCount=excelData.filter(data=>data.AccountRefresh==="Quick run")

  console.log('akjhckjac',excelData?.filter(data=>data.AccountRefresh==='Large run'
    )?.length)

  return (
    <TableContainer component={Paper}>
      <Typography
        sx={{ fontSize: "25px", fontWeight: 600, backgroundColor: "grey" }}
      >
        <Box sx={{marginLeft:'15px'}}>
        Visualizations
        </Box>
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{ fontSize: "20px", fontWeight: 600 }}
            >
              Account Monitored
            </TableCell>
          </TableRow>
        </TableHead>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "17px", fontWeight: 550 }}>
              Total MDM IDs
            </TableCell>
            <TableCell>{excelData?.length}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Large run</TableCell>
            <TableCell>{excelData?.filter(data=>data.AccountRefresh==='Large run'
    )?.length}</TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "grey",
                }}
              >
                Add/Modify Account ID
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Quick run</TableCell>
            <TableCell>
{excelData?.filter(data=>data.AccountRefresh==='Quick run'
    )?.length}

            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "grey",
                }}
              >
                Add/Modify Account ID
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VisualizationComponent;
