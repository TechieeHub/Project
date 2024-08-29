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

const VisualizationComponent = () => {

  const dispatch=useDispatch()
  const excelData = useSelector((state) => state.excel.data)?.filter(
    (data) => data.is_deleted !== true
  );


  const largeRunViewHandler=()=>{
    const data=excelData.filter(data=>data.AccountRefresh==='Large run')
    dispatch(setChartDisplayData(data))
  }

  const quickRunViewHandler=()=>{
    const data=excelData.filter(data=>data.AccountRefresh==='Quick run')
    dispatch(setChartDisplayData(data))
  }
  return (
    <TableContainer component={Paper}>
      <Typography
        sx={{ fontSize: "25px", fontWeight: 600, backgroundColor: "grey" }}
      >
        <Box sx={{ marginLeft: "15px" }}>Account Monitored</Box>
      </Typography>
      <Table>
        <TableHead>
          
        </TableHead>
        <TableHead>
          {/* <TableRow>
            <TableCell sx={{ fontSize: "17px", fontWeight: 550 }}>
              Total MDM IDs
            </TableCell>
            <TableCell>{excelData?.length}</TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell sx={{ fontSize: "17px", fontWeight: 550 }}>
              Total MDM IDs
            </TableCell>
            <TableCell>{excelData?.length}</TableCell>
            <TableCell></TableCell>
            <TableCell>
                            <Button
                key={'Add/ModifyAccountId'}
                component={Link}  
                to={"/"}   
                sx={{
                  my: 2,
                  display: 'block',
                  textDecoration: 'underline', // Underline the text
                  '&:hover': {
                    textDecoration: 'underline', // Ensure underline on hover as well
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
            <TableCell>Large run</TableCell>
            <TableCell>
              {
                excelData?.filter((data) => data.AccountRefresh === "Large run")
                  ?.length
              }
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
              {/* <Button
                variant="contained"
                sx={{
                  backgroundColor: "grey",
                }}

                // onClick={()=>largeRunViewHandler()}
              >
                View
              </Button> */}
                            <Button
                key={'largeRunView'}
                // component={Link}  
                // to={"/"}   
                sx={{
                  my: 2,
                  display: 'block',
                  textDecoration: 'underline', // Underline the text
                  '&:hover': {
                    textDecoration: 'underline', // Ensure underline on hover as well
                  },
                }}
              >
                View
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Quick run</TableCell>
            <TableCell>
              {
                excelData?.filter((data) => data.AccountRefresh === "Quick run")
                  ?.length
              }
            </TableCell>
            <TableCell></TableCell>
            <TableCell>
            <Button
                key={'quickRunView'}
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

export default VisualizationComponent;
