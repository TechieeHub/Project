import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import TableComponent from "../TableComponent/TableComponent";
import { setTableData } from "../../Store/excelSlice";
import { useLocation } from "react-router-dom";

const TablePage = () => {
  const [excelData, setExcelData] = useState(null);
  const [deletedColumns, setDeletedColumns] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        setExcelData(response.data.records);
        setDeletedColumns(response.data.deleted_columns);
        dispatch(setTableData(response.data.records));
      })
      .catch((error) => console.log("error", error));
  }, [dispatch]);

  return (
    <Box>
      {excelData?.length > 0 ? (
        <TableComponent
          excelData={excelData}
          setExcelData={setExcelData}
          deletedColumns={deletedColumns}
          location={location}
        />
      ) : (
        <Box sx={{ height: "40px", background: "#D3D3D3", marginTop: "3px" }}>
          No File is uploaded yet!
        </Box>
      )}
    </Box>
  );
};

export default TablePage;
