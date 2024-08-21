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

const VisualizationComponent = () => {
  return (
    <TableContainer component={Paper}>
      <Typography
        sx={{ fontSize: "25px", fontWeight: 600, backgroundColor: "grey" }}
      >
        Visualizations
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
            <TableCell>12</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Large run</TableCell>
            <TableCell>2</TableCell>
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
            <TableCell>10</TableCell>
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
