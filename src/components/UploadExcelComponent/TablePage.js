import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import TableComponent from "../TableComponent/TableComponent";
import { useDispatch } from "react-redux";
import { setTableData } from "../../Store/excelSlice";
import { useLocation } from "react-router-dom";

const TablePage = () => {
  const [excelData, setExcelData] = useState(null);
  const [deletedColumns, setDeletedColumns] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    setLoading(true); // Set loading to true when the fetch starts
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        setExcelData(response.data.records);
        setDeletedColumns(response.data.deleted_columns);
        dispatch(setTableData(response.data.records));
        setLoading(false); // Set loading to false after the data is fetched
      })
      .catch((error) => {
        console.log("error", error);
        setLoading(false); // Even on error, stop the loading spinner
      });
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ margin: "1rem" }}>
      {excelData?.length > 0 ? (
        <TableComponent
          excelData={excelData}
          setExcelData={setExcelData}
          deletedColumns={deletedColumns}
          location={location}
        />
      ) : (
        <Box
          sx={{ height: "40px", background: "#D3D3D3", marginTop: "3px" }}
        >
          No File is uploaded yet!
        </Box>
      )}
    </Box>
  );
};

export default TablePage;
