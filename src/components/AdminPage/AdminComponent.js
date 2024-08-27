import { Box, Button, IconButton, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
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

    // Add custom column for icons
    const actionColumn = {
      accessorKey: 'actions',
      header: 'Actions',
      Cell: ({ row }) => (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <IconButton 
            color="success"
            onClick={() => handleApprove(row.original)}
          >
            <CheckCircleIcon />
          </IconButton>
          <IconButton 
            color="error" 
            onClick={() => handleReject(row.original)}
          >
            <CancelIcon />
          </IconButton>
        </Box>
      ),
    };

    return [...dataColumns, actionColumn];
  }, [excelData]);

  const filteredData = useMemo(() => {
    return excelData.filter((row) => row.is_deleted === true && row.deleted_by_admin !== true);
  }, [excelData]);

  const handleApprove = (rowData) => {
    console.log('Approve clicked', rowData?._id);
    axios.post(`http://localhost:8000/api/record_deletion_approved/${rowData?._id}/`)
      .then((resp => setRefreshData(!refreshData)))
      .catch(error => console.warn('Something went wrong'));
  };

  const handleReject = (rowData) => {
    console.log('Reject clicked', rowData);
    setRefreshData(!refreshData);
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

  const hanldeApproveAllColumnDeletions = () => {
    setRefreshData(!refreshData);
  };

  const hanldeRejectAllColumnDeletions = () => {
    setRefreshData(!refreshData);
  };

  const hanldeApproveAllRowDeletions = () => {
    setRefreshData(!refreshData);
  };

  const hanldeRejectAllRowDeletions = () => {
    setRefreshData(!refreshData);
  };

  return (
    <>
      {filteredData.length > 0 &&
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
            onClick={() => hanldeApproveAllColumnDeletions()}
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
            onClick={() => hanldeRejectAllColumnDeletions()}
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
            onClick={() => hanldeApproveAllRowDeletions()}
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
            onClick={() => hanldeRejectAllRowDeletions()}
          >
            Reject All Row Deletions
          </Button>
        </>
      }

      {/* Conditionally render the table or "No records found" */}
      {filteredData.length > 0 ? (
        <MaterialReactTable table={table} />
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No records found
        </Typography>
      )}
    </>
  );
};

export default AdminComponent;
