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

    // Map existing data columns
    const dataColumns = Object.keys(excelData[0]).map((key) => ({
      accessorKey: key, // column key in the data
      header: key.replace(/_/g, ' ').toUpperCase(), // header name, formatted
      isVisible: key !== "_id" && key !== "is_deleted", // hide these specific columns
    }));

    // Add custom column for buttons
    const actionColumn = {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant="contained" 
            size="small" 
            onClick={() => handleApprove(row.original)}
          >
            Approve
          </Button>
          <Button 
            variant="contained" 
            size="small" 
            color="error" 
            onClick={() => handleReject(row.original)}
          >
            Reject
          </Button>
        </Box>
      ),
    };

    return [...dataColumns, actionColumn];
  }, [excelData]);

  const filteredData = useMemo(() => {
    return excelData.filter((row) => row.is_deleted === true);
  }, [excelData]);

  const handleApprove = (rowData) => {
    console.log('Approve clicked', rowData);
    // Add your approve logic here
  };

  const handleReject = (rowData) => {
    console.log('Reject clicked', rowData);
    // Add your reject logic here
  };

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
  });

  console.log('excelData', excelData);
  return (
    <>
      {/* Your existing buttons */}
      <MaterialReactTable table={table} />
    </>
  );
};

export default AdminComponent;
