import { Box, Button } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const AdminComponent = () => {
  const [excelData, setExcelData] = useState([]); // Initialize as an empty array
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        setExcelData(response.data.records);
      })
      .catch((error) => console.log("error", error));
    setRefreshData(false);
  }, [refreshData]);

  const columns = useMemo(() => {
    if (!excelData || excelData.length === 0) return [];

    return Object.keys(excelData[0]).map((key) => ({
      accessorKey: key, // column key in the data
      header: key.replace(/_/g, ' ').toUpperCase(), // header name, formatted
      isVisible: key !== "_id" && key !== "is_deleted", // hide these specific columns
    }));
  }, [excelData]);
  const filteredData = useMemo(() => {
    return excelData.filter((row) => row.is_deleted === true);
  }, [excelData]);

  const table = useMaterialReactTable({
    columns: columns,
    initialState: { columnVisibility: { _id: false, is_deleted: false } },
    data: filteredData,
    enableEditing: false,
    enableDensityToggle: false,
    enableColumnOrdering: false,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#818589",
        color: "#ffffff",
        fontWeight: "bold",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      // sx: {
      //   // backgroundColor: row.original.is_deleted && "#F8C8DC",
      //   opacity: row.original.is_deleted && 0.8,
      // },
    }),
  });


  console.log('excelData',excelData)
  return (
    <>
      <Button
        variant="contained"
        sx={{
          maxHeight: "20px",
          fontSize: '9px',
          marginLeft: "20px",
          marginTop: "30px",
          backgroundColor: "grey",
        }}
      >
        Approve All Column Deletions
      </Button>
      <Button
        variant="contained"
        sx={{
          maxHeight: "20px",
          fontSize: '9px',
          marginLeft: "20px",
          marginTop: "30px",
          backgroundColor: "grey",
        }}
      >
        Reject All Column Deletions
      </Button>
      <Button
        variant="contained"
        sx={{
          maxHeight: "20px",
          fontSize: '9px',
          marginLeft: "20px",
          marginTop: "30px",
          backgroundColor: "grey",
        }}
      >
        Approve All Row Deletions
      </Button>
      <Button
        variant="contained"
        sx={{
          maxHeight: "20px",
          fontSize: '9px',
          marginLeft: "20px",
          marginTop: "30px",
          backgroundColor: "grey",
        }}
      >
        Reject All Row Deletions
      </Button>

      <MaterialReactTable table={table} />
    </>
  );
};

export default AdminComponent;
