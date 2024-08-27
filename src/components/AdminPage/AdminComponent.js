import { Box, Button, IconButton, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

const AdminComponent = () => {
  const [excelData, setExcelData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [deletedColumnData, setDeletedColumnData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        setExcelData(response.data.records);
        setDeletedColumnData(response.data.deleted_columns);
      })
      .catch((error) => console.log("error", error));
    setRefreshData(false);
  }, [refreshData]);

  const columns = useMemo(() => {
    if (!excelData || excelData.length === 0) return [];

    const dataColumns = Object.keys(excelData[0]).map((key) => ({
      accessorKey: key,
      header: key.replace(/_/g, " ").toUpperCase(),
      isVisible: key !== "_id" && key !== "is_deleted",
    }));

    const actionColumn = {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <IconButton color="success" onClick={() => handleApprove(row.original)}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleReject(row.original)}>
            <CancelIcon />
          </IconButton>
        </Box>
      ),
    };

    return [...dataColumns, actionColumn];
  }, [excelData]);

  const deletedColumnColumns = useMemo(() => [
    {
      accessorKey: "account_id",
      header: "Column Name",
    },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <IconButton color="success" onClick={() => handleApproveColumn(row.original)}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleRejectColumn(row.original)}>
            <CancelIcon />
          </IconButton>
        </Box>
      ),
    },
  ], []);

  const filteredData = useMemo(() => {
    return excelData.filter(
      (row) => row.is_deleted === true && row.deleted_by_admin !== true
    );
  }, [excelData]);

  const handleApprove = (rowData) => {
    const data={record_ids:[rowData?._id]}

    axios
      .post(`http://localhost:8000/api/record_deletion_approved/`,data)
      .then(() => setRefreshData(!refreshData))
      .catch((error) => console.warn("Something went wrong"));
  };

  const handleReject = (rowData) => {
    const data={record_ids:[rowData?._id]}
    axios
      .post(`http://localhost:8000/api/record_deletion_disapproved/`,data)
      .then(() => setRefreshData(!refreshData))
      .catch((error) => console.warn("Something went wrong"));
  };

  const handleApproveColumn = (columnData) => {
    // Implement logic to handle column approval
    console.log('Approving column:', columnData);
    // Example: axios.post(`http://localhost:8000/api/column_deletion_approved/${columnData.account_id}/`)
    setRefreshData(!refreshData);
  };

  const handleRejectColumn = (columnData) => {
    // Implement logic to handle column rejection
    console.log('Rejecting column:', columnData);
    // Example: axios.post(`http://localhost:8000/api/column_deletion_disapproved/${columnData.account_id}/`)
    setRefreshData(!refreshData);
  };

  const tableRow = useMaterialReactTable({
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

  const tableColumn = useMaterialReactTable({
    columns: deletedColumnColumns,
    initialState: { columnVisibility: { _id: false, is_deleted: false } },
    data: deletedColumnData.map(item => ({ account_id: item })),
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

  const handleApproveAllRowDeletions = () => {
    // const data=filteredData.map()
    const payload=filteredData.map(data=>data?._id)
    const data={record_ids:payload}

    axios
      .post(`http://localhost:8000/api/record_deletion_approved/`,data)
      .then(() => setRefreshData(!refreshData))
      .catch((error) => console.warn("Something went wrong"));

  };

  const handleRejectAllRowDeletions = () => {
    const payload=filteredData.map(data=>data?._id)
    const data={record_ids:payload}

    axios
      .post(`http://localhost:8000/api/record_deletion_disapproved/`,data)
      .then(() => setRefreshData(!refreshData))
      .catch((error) => console.warn("Something went wrong"));
  };

  const handleApproveAllColumnDeletions = () => {
    setRefreshData(!refreshData);
  };

  const handleRejectAllColumnDeletions = () => {
    setRefreshData(!refreshData);
  };

  return (
    <>
      {filteredData.length > 0 && (
        <>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              fontSize: "9px",
              marginLeft: "30px",
              marginTop: "30px",
              backgroundColor: "grey",
            }}
            onClick={handleApproveAllRowDeletions}
          >
            Approve All Rows
          </Button>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              fontSize: "9px",
              marginLeft: "30px",
              marginTop: "30px",
              backgroundColor: "grey",
            }}
            onClick={handleRejectAllRowDeletions}
          >
            Reject All Rows
          </Button>
          <MaterialReactTable table={tableRow} />
        </>
      )}
      {deletedColumnData.length > 0 && (
        <>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              fontSize: "9px",
              marginLeft: "30px",
              marginTop: "30px",
              backgroundColor: "grey",
            }}
            onClick={handleApproveAllColumnDeletions}
          >
            Approve All Columns
          </Button>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              fontSize: "9px",
              marginLeft: "30px",
              marginTop: "30px",
              backgroundColor: "grey",
            }}
            onClick={handleRejectAllColumnDeletions}
          >
            Reject All Columns
          </Button>
          <MaterialReactTable table={tableColumn} />
        </>
      )}
      {filteredData.length === 0 && deletedColumnData.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No records found
        </Typography>
      )}
    </>
  );
};

export default AdminComponent;
