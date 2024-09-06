import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Bar } from "react-chartjs-2";

const AdminComponent = () => {
  const [excelData, setExcelData] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [deletedColumnData, setDeletedColumnData] = useState([]);
  const [deletedColumnByAdmin, setDeletedColumnByAdmin] = useState([]);
  const [approvedDeletedRowsByAdmin, setApprovedDeletedRowsByAdmin] = useState(
    []
  );
  const [approvedDeletedColumnsByAdmin, setApprovedDeletedColumnsByAdmin] =
    useState([]);
  const [rejectedDeletedRowsByAdmin, setRejectedDeletedRowsByAdmin] = useState(
    []
  );
  const [rejectedDeletedColumnsByAdmin, setRejectedDeletedColumnsByAdmin] =
    useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/data/")
      .then((response) => {
        setExcelData(response?.data?.records);

        setApprovedDeletedRowsByAdmin(response?.data?.deleted_by_admin_records);
        setApprovedDeletedColumnsByAdmin(
          response?.data?.deleted_by_admin_columns
        );
        setRejectedDeletedRowsByAdmin(
          response?.data?.rejected_by_admin_records
        );
        setRejectedDeletedColumnsByAdmin(
          response?.data?.rejected_by_admin_columns
        );

        setDeletedColumnData(response?.data?.deleted_columns);
        setDeletedColumnByAdmin(response?.data?.deleted_by_admin_columns);
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
        <Box sx={{ display: "flex", gap: "0.5rem", fontFamily: 'Roboto' }}>
          <IconButton
            color="success"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to approve this row deletion?")
              ) {
                handleApprove(row.original);
              }
            }}
          >
            <CheckCircleIcon />
          </IconButton>
          <IconButton color="error" 
          onClick={() => {
            if (window.confirm("Are you sure you want to reject this row deletion?")) {
              handleReject(row.original);
            }
          }}          
          >
            <CancelIcon />
          </IconButton>
        </Box>
      ),
    };

    return [...dataColumns, actionColumn];
  }, [excelData]);

  const deletedColumnColumns = useMemo(
    () => [
      {
        accessorKey: "account_id",
        header: "Column Name",
      },
      {
        accessorKey: "actions",
        header: "Actions",
        Cell: ({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem", fontFamily: 'Roboto' }}>
            <IconButton
              color="success"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to approve this column deletion?")
                ) {
                  handleApproveColumn(row.original)
                }
              }}
              
              
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to reject this column deletion?")
                ) {
                  handleRejectColumn(row.original)
                }
              }}
            >
              <CancelIcon />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    return excelData.filter(
      (row) => row.is_deleted === true && row.deleted_by_admin !== true
    );
  }, [excelData]);

  const handleApprove = (rowData) => {
    const data = { record_ids: [rowData?._id] };

    axios
      .post(`http://localhost:8000/api/record_deletion_approved/`, data)
      .then(() => setRefreshData(!refreshData))
      .catch((error) => console.warn("Something went wrong"));
  };

  const handleReject = (rowData) => {
    const data = { record_ids: [rowData?._id] };
    axios
      .post(`http://localhost:8000/api/record_deletion_disapproved/`, data)
      .then(() => setRefreshData(!refreshData))
      .catch((error) => console.warn("Something went wrong"));
  };

  const handleApproveColumn = (columnData) => {
    const data = { column_names: [columnData.account_id] };
    console.log("kjcvjdsv", data);
    if (data) {
      axios
        .post(`http://localhost:8000/api/col_deletion_approval/`, data)
        .then(() => setRefreshData(!refreshData))
        .catch((error) => console.warn("Something went wrong"));
    }
  };

  const handleRejectColumn = (columnData) => {
    const data = { column_names: [columnData.account_id] };
    if (data) {
      axios
        .post(`http://localhost:8000/api/col_deletion_rejection/`, data)
        .then(() => setRefreshData(!refreshData))
        .catch((error) => console.warn("Something went wrong"));
    }
  };

  const tableRow = useMaterialReactTable({
    columns: columns,
    initialState: { columnVisibility: { _id: false, is_deleted: false } },
    data: filteredData,
    enableEditing: false,
    enableFilters: false,
    enableDensityToggle: false,
    enableColumnOrdering: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableHiding: "false",

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#818589",
        color: "#ffffff",
        fontWeight: "bold",
        fontFamily: 'Roboto'
      },
    },
  });
  const diffArr = deletedColumnData.filter(
    (x) => !deletedColumnByAdmin?.includes(x)
  );

  const tableColumn = useMaterialReactTable({
    columns: deletedColumnColumns,
    initialState: { columnVisibility: { _id: false, is_deleted: false } },
    data: diffArr.map((item) => ({ account_id: item })),
    enableEditing: false,
    enableDensityToggle: false,
    enableColumnOrdering: false,
    enableFullScreenToggle: false,
    enableFilters: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableHiding: "false",
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#818589",
        color: "#ffffff",
        fontWeight: "bold", fontFamily: 'Roboto'
      },
    },
  });

  const handleApproveAllRowDeletions = () => {
    // const data=filteredData.map()
    const payload = filteredData.map((data) => data?._id);
    const data = { record_ids: payload };

    axios
      .post(`http://localhost:8000/api/record_deletion_approved/`, data)
      .then(() => setRefreshData(!refreshData))
      .catch((error) => console.warn("Something went wrong"));
  };

  const handleRejectAllRowDeletions = () => {
    const payload = filteredData.map((data) => data?._id);
    const data = { record_ids: payload };

    axios
      .post(`http://localhost:8000/api/record_deletion_disapproved/`, data)
      .then(() => setRefreshData(!refreshData))
      .catch((error) => console.warn("Something went wrong"));
  };

  const handleApproveAllColumnDeletions = () => {
    const data = { column_names: deletedColumnData };
    if (data) {
      axios
        .post(`http://localhost:8000/api/col_deletion_approval/`, data)
        .then(() => setRefreshData(!refreshData))
        .catch((error) => console.warn("Something went wrong"));
    }
  };

  const handleRejectAllColumnDeletions = () => {
    const data = { column_names: deletedColumnData };
    if (data) {
      axios
        .post(`http://localhost:8000/api/col_deletion_rejection/`, data)
        .then(() => setRefreshData(!refreshData))
        .catch((error) => console.warn("Something went wrong"));
    }
  };

  const chartData = useMemo(() => {
    return {
      labels: ["Approved Rows", "Approved Columns", "Rejected Rows", "Rejected Columns"],
      datasets: [
        {
          label: "Admin Actions",
          data: [
            approvedDeletedRowsByAdmin.length,
            approvedDeletedColumnsByAdmin.length,
            rejectedDeletedRowsByAdmin.length,
            rejectedDeletedColumnsByAdmin.length,
          ],
          backgroundColor: ["#4caf50", "#2196f3", "#f44336", "#ff9800"],
        },
      ],
    };
  }, [
    approvedDeletedRowsByAdmin,
    approvedDeletedColumnsByAdmin,
    rejectedDeletedRowsByAdmin,
    rejectedDeletedColumnsByAdmin,
  ]);

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


  return (
    <Box sx={{ margin: "1rem" }}>
      {filteredData.length > 0 && (
        <Box
          sx={{
            marginTop: "20px",
            backgroundColor: "#D3D3D3",
            paddingBottom: "20px",
            marginBottom: "15px",
            borderRadius: "20px",
          }}
        >
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "25px",
              padding: "20px 0px 0px 15px", fontFamily: 'Roboto'
            }}
          >
            Rows Deleted By User
          </Typography>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              fontSize: "9px",
              marginLeft: "30px",
              marginTop: "30px",
              backgroundColor: "grey", fontFamily: 'Roboto'
            }}
            // onClick={handleApproveAllRowDeletions}

            onClick={() => {
              if (
                window.confirm("Are you sure you want to approve all row deletions?")
              ) {
                handleApproveAllRowDeletions()
              }
            }}


          >
            Approve All
          </Button>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              fontSize: "9px",
              marginLeft: "30px",
              marginTop: "30px",
              backgroundColor: "grey", fontFamily: 'Roboto'
            }}

            onClick={() => {
              if (
                window.confirm("Are you sure you want to reject all row deletions?")
              ) {
                // handleRejectColumn(row.original)
                handleRejectAllRowDeletions()
              }
            }}
          >
            Reject All
          </Button>
          <Box
            sx={{
              width: "98%",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "10px",
            }}
          >
            <MaterialReactTable table={tableRow} />
          </Box>
        </Box>
      )}
      {diffArr.length > 0 && (
        <Box
          sx={{
            paddingBottom: "20px",
            // borderTopLeftRadius: "15px",
            // borderTopRightRadius: "15px",
            borderRadius: "20px",

            backgroundColor: "#D3D3D3",
          }}
        >
          <Typography
            sx={{
              fontWeight: "700",
              fontSize: "25px",
              padding: "20px 0px 0px 15px" , fontFamily: 'Roboto'
            }}
          >
            Columns Deleted By User
          </Typography>

          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              fontSize: "9px",
              marginLeft: "30px",
              marginTop: "30px",
              backgroundColor: "grey", fontFamily: 'Roboto'
            }}
            // onClick={handleApproveAllColumnDeletions}
            onClick={() => {
              if (
                window.confirm("Are you sure you want to approve all column deletions?")
              ) {
                // handleApproveColumn(row.original)
                handleApproveAllColumnDeletions()
              }
            }}
            
          >
            Approve All
          </Button>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              fontSize: "9px",
              marginLeft: "30px",
              marginTop: "30px",
              backgroundColor: "grey", fontFamily: 'Roboto'
            }}
            onClick={() => {
              if (
                window.confirm("Are you sure you want to reject all column deletions?")
              ) {
                handleRejectAllColumnDeletions()
              }
            }}
          >
            Reject All
          </Button>
          <Box
            sx={{
              width: "100%",
              maxWidth: "500px",
              marginLeft: "10px",
              marginRight: "30px",
              marginTop: "10px",
            }}
          >
            <MaterialReactTable table={tableColumn} />
          </Box>
        </Box>
      )}
      {filteredData.length === 0 &&
        diffArr.length === 0 &&
        !approvedDeletedRowsByAdmin &&
        !approvedDeletedColumnsByAdmin &&
        !rejectedDeletedRowsByAdmin &&
        !rejectedDeletedColumnsByAdmin && (
          <Typography variant="h6" align="center" sx={{ mt: 4 , fontFamily: 'Roboto'}}>
            No records found
          </Typography>
        )}
<Box sx={{display:'flex', gap:'50px'}}>
      <TableContainer
        component={Paper}
        // sx={{
        //   maxWidth: "700px",
        //   marginTop: "30px",
        //   marginBottom: "50px",
        //   marginLeft: "10px",
        // }}
        sx={{
          maxWidth: "50%",  // Adjust to ensure equal width with the chart
          flexGrow: 1,      // Allows the table to grow equally with the chart
          marginTop: "30px",
          marginBottom: "50px",
          marginLeft: "10px",
        }}
      >
        <Typography
          sx={{ fontSize: "25px", fontWeight: 600, backgroundColor: "grey", fontFamily: 'Roboto' }}
        >
          <Box sx={{ marginLeft: "15px" , fontFamily: 'Roboto'}}>Admin Records</Box>
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: "17px" }}>
                <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                  Row Deletions Approved By Admin
                </Typography>
              </TableCell>
              <TableCell sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                {approvedDeletedRowsByAdmin?.length}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                  Column Deletions Approved By Admin
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                  {approvedDeletedColumnsByAdmin?.length}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                  Row Deletions Rejected By Admin
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                  {rejectedDeletedRowsByAdmin?.length}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                  Column Deletions Rejected By Admin
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontSize: "20px", fontFamily: 'Roboto' }}>
                  {rejectedDeletedColumnsByAdmin?.length}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box 
      sx={{
        flexGrow: 1,      // Allows the chart to grow equally with the table
        maxWidth: "50%",  // Adjust to ensure equal width with the table
        marginTop: "20px",
      }}      
      >
        <Typography sx={{ fontSize: "25px", fontWeight: 600, fontFamily: 'Roboto' }}>Admin Actions Overview</Typography>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
    </Box>
  );
};

export default AdminComponent;
