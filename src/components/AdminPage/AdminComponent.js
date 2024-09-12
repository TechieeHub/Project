import {
  Box,
  Button,
  Card,
  CardContent,
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
import { useInfiniteQuery } from "react-query";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Bar } from "react-chartjs-2";
import ConfirmModal from "../ModalComponnet/Modal";

const AdminComponent = () => {
  const [excelData, setExcelData] = useState([]);
  const [modalOpen, setModelOpen] = useState(false);
  const [conformation, setConformation] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        <Box
          sx={{
            display: "flex",
            gap: "0.5rem",
            height: "30px",
            fontFamily: "Roboto",
          }}
        >
          <IconButton
            color="success"
            onClick={() => {
              setModalDescription(
                "Are you sure you want to approve this row deletion?"
              );
              setOpen(true);
              setConformation({ type: "rowApprove", item: row.original });
            }}
          >
            {Object.entries(row.original).length !== 0 && <CheckCircleIcon />}
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              setModalDescription(
                "Are you sure you want to reject this row deletion?"
              );
              setOpen(true);
              setConformation({ type: "rowReject", item: row.original });
            }}
          >
            {Object.entries(row.original).length !== 0 && <CancelIcon />}
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
          <Box
            sx={{
              display: "flex",
              gap: "0.5rem",
              height: "30px",
              fontFamily: "Roboto",
            }}
          >
            <IconButton
              color="success"
              onClick={() => {
                setModalDescription(
                  "Are you sure you want to approve this column deletion?"
                );
                setOpen(true);
                setConformation({ type: "columnApprove", item: row.original });
              }}
            >
              {Object.entries(row.original).length !== 0 && <CheckCircleIcon />}
            </IconButton>
            <IconButton
              color="error"
              onClick={() => {
                setModalDescription(
                  "Are you sure you want to reject this column deletion?"
                );
                setOpen(true);
                setConformation({ type: "columnReject", item: row.original });
              }}
            >
              {Object.entries(row.original).length !== 0 && <CancelIcon />}
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
    handleOpen();
    setModalDescription("Are you sure you want to approve this row deletion?");

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
  const diffArr = deletedColumnData.filter(
    (x) => !deletedColumnByAdmin?.includes(x)
  );
  const maxRowDiff =
    filteredData?.length > diffArr?.length
      ? filteredData?.length
      : diffArr?.length;

  const tableRowData =
    filteredData?.length > maxRowDiff
      ? filteredData
      : [
          ...filteredData,
          ...Array.from({ length: maxRowDiff - filteredData?.length }).map(
            () => ({})
          ),
        ];

  const tableRow = useMaterialReactTable({
    columns: columns,
    initialState: { columnVisibility: { _id: false, is_deleted: false } },
    data: tableRowData,
    enableEditing: false,
    enableFilters: false,
    enableDensityToggle: false,
    enableColumnOrdering: false,
    enableFullScreenToggle: false,
    enablePagination: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableHiding: false,

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#818589",
        color: "#ffffff",
        fontWeight: "bold",
        fontFamily: "Roboto",
        height: "10px",
      },
    },
  });

  const tableColData = diffArr.map((item) => ({ account_id: item }));

  const tableColumnData =
    tableColData?.length > maxRowDiff
      ? tableColData
      : [
          ...tableColData,
          ...Array.from({ length: maxRowDiff - tableColData?.length }).map(
            () => ({})
          ),
        ];

  const tableColumn = useMaterialReactTable({
    columns: deletedColumnColumns,
    initialState: { columnVisibility: { _id: false, is_deleted: false } },
    data: tableColumnData,
    enableEditing: false,
    enableDensityToggle: false,
    enableColumnOrdering: false,
    enablePagination: false,
    enableFullScreenToggle: false,
    enableFilters: false,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableHiding: false,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#818589",
        color: "#ffffff",
        fontWeight: "bold",
        fontFamily: "Roboto",
        height: "48px",
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
      labels: [
        "Approved Rows",
        "Approved Columns",
        "Rejected Rows",
        "Rejected Columns",
      ],
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

  // Ishan
  const handleConfirm = (confirmed) => {
    if (confirmed === true) {
      if (conformation?.type === "rowApprove") {
        handleApprove(conformation?.item);
      }
      if (conformation?.type === "rowReject") {
        handleReject(conformation?.item);
      }
      if (conformation?.type === "columnApprove") {
        handleApproveColumn(conformation?.item);
      }
      if (conformation?.type === "columnReject") {
        handleRejectColumn(conformation?.item);
      }
      if (conformation?.type === "allRowApprove") {
        handleApproveAllRowDeletions();
      }
      if (conformation?.type === "allRowReject") {
        handleRejectAllRowDeletions();
      }
      if (conformation?.type === "allColumnApprove") {
        handleApproveAllColumnDeletions();
      }
      if (conformation?.type === "allColumnReject") {
        handleRejectAllColumnDeletions();
      }

      //   if (conformation?.type === 'row') {
      //     handleApprove(conformation?.item);
      //   } else if (conformation?.type === 'column') {
      //     handleApproveColumn(conformation?.item);
      //   }
      // } else {
      //   if (conformation.type === 'row') {
      //     handleReject(conformation?.item);
      //   } else if (conformation?.type === 'column') {
      //     handleRejectColumn(conformation?.item);
      //   }
    }
    setOpen(false); // Close the modal
  };

  return (
    <>
      <ConfirmModal
        open={open}
        handleClose={handleClose}
        handleConfirm={handleConfirm}
        title={modalDescription}
      />

      <Box sx={{ margin: "1rem" }}>
        <Box
          sx={{
            display: "flex",
            gap: "30px",
            justifyContent: "center",
            margin: "20px 40px",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                sx={{
                  color: "text.secondary",
                  fontSize: "40px",
                  textAlign: "center",
                }}
              >
                {approvedDeletedRowsByAdmin?.length}
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                Account deletions approved
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                sx={{
                  color: "text.secondary",
                  fontSize: "40px",
                  textAlign: "center",
                }}
              >
                {rejectedDeletedRowsByAdmin?.length}
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                Account deletions rejected
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                sx={{
                  color: "text.secondary",
                  fontSize: "40px",
                  textAlign: "center",
                }}
              >
                {approvedDeletedColumnsByAdmin?.length}
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                Account attribute deletions approved
              </Typography>
            </CardContent>
          </Card>
          <Card
            variant="outlined"
            sx={{
              flex: 1,
              borderRadius: "16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CardContent>
              <Typography
                gutterBottom
                sx={{
                  color: "text.secondary",
                  fontSize: "40px",
                  textAlign: "center",
                }}
              >
                {rejectedDeletedColumnsByAdmin?.length}
              </Typography>
              <Typography sx={{ textAlign: "center" }}>
                Account attribute deletions rejected
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ display: "flex", gap: "20px" }}>
          {filteredData.length > 0 && (
            <Box
              sx={{
                marginTop: "20px",
                // backgroundColor: "#D3D3D3",
                paddingBottom: "20px",
                marginBottom: "15px",
                borderRadius: "20px",
                width: "50%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: "25px",
                  padding: "20px 0px 0px 15px",
                }}
              >
                Accounts deleted by user
              </Typography>
              <Button
                variant="contained"
                sx={{
                  maxHeight: "30px",
                  fontSize: "9px",
                  marginLeft: "30px",
                  marginTop: "30px",
                  backgroundColor: "rgba(144, 238, 144, 0.3)",
                  color: "black", // Adjust the text color for better readability if needed
                  "&:hover": {
                    backgroundColor: "rgba(144, 238, 144, 0.5)", // slightly darker on hover
                  },
                }}
                onClick={() => {
                  setModalDescription(
                    "Are you sure you want to approve all row deletions?"
                  );
                  setOpen(true);
                  setConformation({ type: "allRowApprove" });
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
                  backgroundColor: "rgba(255, 0, 0, 0.4)", // light red with 30% opacity
                  color: "black", // Adjust the text color for better readability if needed
                  '&:hover': {
                    backgroundColor: "rgba(255, 0, 0, 0.5)", // slightly darker red on hover
                  }
                }}
                // onClick={() => {
                //   if (
                //     window.confirm(
                //       "Are you sure you want to reject all row deletions?"
                //     )
                //   ) {
                //     // handleRejectColumn(row.original)
                //     handleRejectAllRowDeletions();
                //   }
                // }}
                onClick={() => {
                  setModalDescription(
                    "Are you sure you want to reject all row deletions?"
                  );
                  setOpen(true);
                  setConformation({ type: "allRowReject" });
                }}
              >
                Reject All
              </Button>

              <Box
                sx={{
                  flexGrow: 1,
                  marginTop: "20px",
                  paddingBottom: "20px",
                  marginBottom: "15px",
                  borderRadius: "20px",
                  // height: "400px", // Fixed height for the table container
                  // overflow: "auto",
                }}
              >
                <MaterialReactTable
                  table={tableRow}
                  sx={{
                    height: "50%",
                  }}
                />
              </Box>
            </Box>
          )}
          {diffArr.length > 0 && (
            <Box
              sx={{
                marginTop: "20px",
                // backgroundColor: "#D3D3D3",
                paddingBottom: "20px",
                marginBottom: "15px",
                borderRadius: "20px",
                width: "50%",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "700",
                  fontSize: "25px",
                  padding: "20px 0px 0px 15px",
                }}
              >
                Account attributes deleted by user
              </Typography>

              <Button
                variant="contained"
                sx={{
                  maxHeight: "30px",
                  fontSize: "9px",
                  marginLeft: "30px",
                  marginTop: "30px",
                  backgroundColor: "rgba(144, 238, 144, 0.3)",
                  color: "black", // Adjust the text color for better readability if needed
                  "&:hover": {
                    backgroundColor: "rgba(144, 238, 144, 0.5)", // slightly darker on hover
                  },
                }}
                onClick={() => {
                  setModalDescription(
                    "Are you sure you want to approve all column deletions?"
                  );
                  setOpen(true);
                  setConformation({ type: "allColumnApprove" });
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
                  // backgroundColor: "grey",
                  backgroundColor: "rgba(255, 0, 0, 0.4)", // light red with 30% opacity
                  color: "black", // Adjust the text color for better readability if needed
                  '&:hover': {
                    backgroundColor: "rgba(255, 0, 0, 0.5)", // slightly darker red on hover
                  }
                }}
                onClick={() => {
                  setModalDescription(
                    "Are you sure you want to reject all column deletions?"
                  );
                  setOpen(true);
                  setConformation({ type: "allColumnReject" });
                }}
              >
                Reject All
              </Button>
              <Box
                sx={{
                  flexGrow: 1,
                  marginTop: "20px",
                  paddingBottom: "20px",
                  marginBottom: "15px",
                  borderRadius: "20px",
                  // height: "400px", // Fixed height for the table container
                  // overflowY: "auto",
                }}
              >
                <MaterialReactTable table={tableColumn} />
              </Box>
              {/* </Box> */}
            </Box>
          )}
        </Box>
        {filteredData.length === 0 &&
          diffArr.length === 0 &&
          !approvedDeletedRowsByAdmin &&
          !approvedDeletedColumnsByAdmin &&
          !rejectedDeletedRowsByAdmin &&
          !rejectedDeletedColumnsByAdmin && (
            <Typography
              variant="h6"
              align="center"
              sx={{ mt: 4, fontFamily: "Roboto" }}
            >
              No records found
            </Typography>
          )}
      </Box>
    </>
  );
};

export default AdminComponent;
