import { useState, useMemo, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Slider,
  Menu,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAnomalyValue, setFilteredData } from "../../Store/excelSlice";

const TableComponent = ({
  excelData,
  setExcelData,
  location,
  deletedColumns,
  refreshDataHandler,
}) => {
  const [open, setOpen] = useState(false);
  const [openAddColumnDialog, setOpenAddColumnDialog] = useState(false);
  const [editedColumns, setEditedColumns] = useState({});
  const [tempColumns, setTempColumns] = useState({});
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnValue, setNewColumnValue] = useState("");
  const [exportOption, setExportOption] = useState(null);
  // const [exportOptionOnRightClick, setExportOptionOnRightClick] = useState(null);

  const [contextMenu, setContextMenu] = useState(null);
  const [sliderValue, setSliderValue] = useState(
    localStorage.getItem("anamolyDataValue")
      ? parseInt(localStorage.getItem("anamolyDataValue"), 10)
      : 10
  );
  const dispatch = useDispatch();

  const anamolyValue = useSelector((state) => state.excel.anomalyValue);
  const anamolyDataValue = anamolyValue ? anamolyValue : sliderValue;

  const handleOpenDialog = () => {
    setTempColumns(editedColumns);
    setOpen(true);
  };
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    localStorage.setItem("anamolyDataValue", newValue);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        }
        : null
    );
  };
  const handleOpenAddColumnDialog = () => {
    setOpenAddColumnDialog(true);
  };
  const handleClose = () => {
    setContextMenu(null);
  };

  const handleCloseAddColumnDialog = () => {
    setOpenAddColumnDialog(false);
  };

  const handleColumnNameChange = (key, newHeader) => {
    setTempColumns((prev) => ({ ...prev, [key]: newHeader }));
  };

  const handleSaveChanges = () => {
    setEditedColumns(tempColumns);
    handleEditColumnName(tempColumns);
    setOpen(false);
  };

  const handleAddColumn = () => {
    const updatedData = excelData.map((row) => ({
      ...row,
      [newColumnName]: newColumnValue,
    }));
    addNewColumnHandler(newColumnName);
    setEditedColumns((prev) => ({ ...prev, [newColumnName]: newColumnName }));
    setNewColumnName("");
    setNewColumnValue("");
    setOpenAddColumnDialog(false);
  };

  const handleDeleteColumn = (columnKey) => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      handleSoftDeleteColumn(columnKey);
    }
  };

  const handleSoftDeleteColumn = (data) => {
    const apidata = {
      column_name: data,
    };
    axios
      .post("http://localhost:8000/api/soft-delete-column/", apidata)
      .then((response) => refreshDataHandler(true))
      .catch((error) => alert("Something went wrong"));
  };

  const handleEditColumnName = (data) => {
    const apidata = {
      old_column_name: Object.keys(data)[0],
      new_column_name: Object.values(data)[0],
    };
    axios
      .post("http://localhost:8000/api/rename-column/", apidata)
      .then((response) => refreshDataHandler(true))
      .catch((error) => console.log("Old and new Name are Same"));
  };
  const handleExport = async () => {
    try {
      let response;
      if (exportOption === "pdf") {
        response = await axios.get("http://localhost:8000/api/export/pdf/", {
          responseType: "blob",
        });
      } else if (exportOption === "excel") {
        response = await axios.get("http://localhost:8000/api/export/excel/", {
          responseType: "blob",
        });
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = exportOption === "pdf" ? "export.pdf" : "export.xlsx";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };

  const handleExportOnRightClick = async (exportOptionOnRightClick) => {
    try {
      let response;
      if (exportOptionOnRightClick === "pdf") {
        response = await axios.get("http://localhost:8000/api/export/pdf/", {
          responseType: "blob",
        });
      } else if (exportOptionOnRightClick === "excel") {
        response = await axios.get("http://localhost:8000/api/export/excel/", {
          responseType: "blob",
        });
      }

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download =
        exportOptionOnRightClick === "pdf" ? "export.pdf" : "export.xlsx";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };
  const convertToNumber = (str) => {
    if (str == null) return 0;
    const cleanedStr = String(str).replace(/[^0-9.-]+/g, "");
    const number = parseFloat(cleanedStr);
    return isNaN(number) ? 0 : number;
  };
  const calculateColumns = (data) => {
    const activeColumns = Object.keys(excelData[0] || {}).filter(
      (key) => !deletedColumns.includes(key) && key.startsWith("EODBalance")
    );

    return data.map((row) => {
      const projectedBalance =
        convertToNumber(row["Available Balance"] || 0) -
        convertToNumber(row["Scheduled Out Balance"] || 0);

      const total = activeColumns.reduce(
        (sum, columnKey) => sum + convertToNumber(row[columnKey] || 0),
        0
      );
      const average5Day =
        activeColumns.length > 0 ? total / activeColumns.length : 0;

      const deviation5DayToday =
        average5Day === 0
          ? 0
          : ((projectedBalance - average5Day) / average5Day) * 100;

      return {
        ...row,
        "Projected Balance": projectedBalance,
        "5-Day average": Math.round(average5Day * 100) / 100,
        Deviation_5Day_Today: isNaN(deviation5DayToday)
          ? 0
          : Math.round(deviation5DayToday * 100) / 100,
        Anomaly:
          deviation5DayToday < 0
            ? "EOD Balance less than 5 day average end of day balance"
            : deviation5DayToday > anamolyDataValue
              ? `EOD balance more than 5 day average end of day balance by ${anamolyDataValue}%`
              : "",
      };
    });
  };

  useEffect(() => {
    dispatch(setAnomalyValue(sliderValue));

    localStorage.setItem("anomalyValue", JSON.stringify(sliderValue));
  }, [dispatch, sliderValue]);

  const updatedExcelData = useMemo(
    () => calculateColumns(excelData),
    [excelData, anamolyDataValue]
  );

  const columns = useMemo(() => {
    const defaultColumns = [
      {
        accessorKey: "Projected Balance",
        header: "Projected Balance",
        size: 250,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(value);
        },
      },
      {
        accessorKey: "5-Day average",
        header: "5-Day average",
        size: 250,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
          }).format(value);
        },
      },
      {
        accessorKey: "Deviation_5Day_Today",
        header: "Deviation_5Day_Today",
        size: 250,
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return `${value}%`;
        },
      },
      { accessorKey: "Anomaly", header: "Anomaly", size: 250 },
    ];

    const dynamicColumns = Object.keys(excelData[0] || {})
      .filter((key) => key !== "deleted_by_admin")
      .map((key) => ({
        accessorKey: key,
        header: editedColumns[key] || key,
        size: 250,
        enableEditing: key !== "_id",
        muiTableBodyCellProps: () => ({
          sx: {
            backgroundColor: deletedColumns.includes(key)
              ? "#FFB7C5"
              : "transparent",
            color: deletedColumns.includes(key) ? "black" : "black",
            opacity: deletedColumns.includes(key) ? 0.8 : 1,
          },
        }),
        isVisible: key !== ("_id" && "is_deleted"),
      }));

    return [...dynamicColumns, ...defaultColumns];
  }, [excelData, editedColumns, deletedColumns]);

  const openDeleteConfirmModal = (row) => {
    if (excelData.length > 1) {
      if (window.confirm("Are you sure you want to delete this row?")) {
        deleteRowHandler(row.original._id);
      }
    } else {
      alert("The Last Record cannot be deleted");
    }
  };

  const editRowHandler = (data) => {
    const { _id, ...dataWithoutId } = data;
    const areAllValuesBlank = Object.values(dataWithoutId).every(
      (value) => value === "" || value === " " || value == null
    );
    if (data._id) {
      axios
        .post(
          `http://localhost:8000/api/create_or_update_record/${data._id}/`,
          dataWithoutId
        )
        .then((response) => refreshDataHandler(true))
        .catch((error) => console.log("error", error));
    } else {
      axios
        .post(
          `http://localhost:8000/api/create_or_update_record/`,
          dataWithoutId
        )
        .then((response) => refreshDataHandler(true))
        .catch((error) => console.log("error", error));
    }
  };
  const handleAddRow = () => {
    if (excelData) {
      const newRow = {};
      Object.keys(excelData[0]).forEach((key) => {
        newRow[key] = "";
      });
      setExcelData([newRow, ...excelData]);
    }
  };

  const filteredData = useMemo(
    () => updatedExcelData.filter((row) => !row.is_deleted),
    [excelData, anamolyDataValue]
  );

  useEffect(() => {
    dispatch(setFilteredData(filteredData));

    localStorage.setItem("filteredData", JSON.stringify(filteredData));
  }, [filteredData, dispatch]);

  const filteredColumn = columns?.filter(
    (data) => !deletedColumns.includes(data?.accessorKey)
  );
  const table = useMaterialReactTable({
    columns: filteredColumn,
    initialState: { columnVisibility: { _id: false, is_deleted: false } },
    data: filteredData,
    enableEditing: true,
    enableDensityToggle: false,
    enableColumnOrdering: true,
    onEditingRowSave: ({ exitEditingMode, row, values }) => {
      const updatedData = [...excelData];
      updatedData[row.index] = values;
      editRowHandler(values);
      exitEditingMode();
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        {!row.original.is_deleted && (
          <Tooltip title="Edit">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}

        {!row.original.is_deleted && (
          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={() => openDeleteConfirmModal(row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    ),
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#818589",
        color: "#ffffff",
        fontWeight: "bold", fontFamily: 'Roboto'
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.original.is_deleted && "#F8C8DC",
        opacity: row.original.is_deleted && 0.8,
      },
    }),
  });

  const deleteRowHandler = (rowId) => {
    axios
      .delete(`http://localhost:8000/api/create_or_update_record/${rowId}/`)
      .then((response) => refreshDataHandler(true))
      .catch((error) => console.log("error", error));
  };

  const addNewColumnHandler = (columnName) => {
    const data = {
      column_name: columnName,
    };

    axios
      .post("http://localhost:8000/api/add-column/", data)
      .then((response) => refreshDataHandler(true))
      .catch((error) => alert("Something went wrong"));
  };

  return (
    <>
      <Box sx={{ margin: "1rem" }}>
        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              marginLeft: "20px",
              marginTop: "30px",
              backgroundColor: "grey", fontFamily: 'Roboto'
            }}
            onClick={handleOpenDialog}
          >
            <EditIcon sx={{ marginRight: "3px", fontSize: "20px" }} />
            Edit columns
          </Button>
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              marginLeft: "20px",
              marginTop: "30px",
              backgroundColor: "grey", fontFamily: 'Roboto'
            }}
            onClick={handleOpenAddColumnDialog}
          >
            <AddIcon sx={{ marginRight: "3px", fontSize: "20px" }} />
            Add Column
          </Button>
          <Button
            onClick={handleAddRow}
            variant="contained"
            sx={{
              maxHeight: "30px",
              marginLeft: "20px",
              marginTop: "30px",
              backgroundColor: "grey",
              fontFamily: 'Roboto',
              display: "flex", // Ensure flexbox is applied for alignment
              alignItems: "center"
            }}
          >
            <AddIcon sx={{ marginRight: "3px", fontSize: "20px" }} /> {/* Add the icon with spacing */}
            Add Row
          </Button>

          <FormControl
            sx={{
              marginLeft: "20px",
              marginTop: "30px",
              minWidth: 120,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <InputLabel
              sx={{
                fontSize: "14px",
                lineHeight: "1.2",
                transform: "translate(14px, 8px) scale(1)", fontFamily: 'Roboto'
              }}
              id="export-select-label"
            >
              Export

            </InputLabel>
            <Select
              labelId="export-select-label"
              id="export-select"
              value={exportOption}
              label="Export"
              onChange={(e) => setExportOption(e.target.value)}
              sx={{
                height: "30px",
                minHeight: "30px",
                fontSize: "14px",
                paddingTop: "2px",
                paddingBottom: "2px", fontFamily: 'Roboto'
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 200,
                    width: 120,
                    "& .MuiMenuItem-root": {
                      fontSize: "14px",
                      padding: "4px 8px", fontFamily: 'Roboto'
                    },
                  },
                },
              }}
            >
              <MenuItem value="pdf">Export to PDF</MenuItem>
              <MenuItem value="excel">Export to Excel</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",

              marginLeft: "20px",
              marginTop: "30px",
              backgroundColor: "grey",
            }}
            onClick={handleExport}
            disabled={!exportOption}
          >
            Export
            
            <FileDownloadIcon sx={{ marginRight: "3px", fontSize: "20px" }} />
          </Button>
          
        </Box>
        {location?.pathname === "/admin" && (
          <Button
            variant="contained"
            sx={{
              maxHeight: "30px",
              marginLeft: "20px",
              marginTop: "30px",
              backgroundColor: "grey", fontFamily: 'Roboto'
            }}
          >
            Approve All Deletions
          </Button>
        )}
        <Dialog open={open} onClose={handleCloseDialog}>
          <DialogTitle>Edit Column Names</DialogTitle>
          <DialogContent>
            {Object.keys(excelData[0] || {})
              .filter((key) => key !== "_id")
              .filter((key) => !deletedColumns.includes(key))
              .map((key) => (
                <Box
                  key={key}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <TextField
                    label={`Edit ${key}`}
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    value={
                      tempColumns[key] !== undefined ? tempColumns[key] : key
                    }
                    onChange={(e) =>
                      handleColumnNameChange(key, e.target.value)
                    }
                  />
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteColumn(key)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} sx={{ color: "grey" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              sx={{ backgroundColor: "grey" }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAddColumnDialog} onClose={handleCloseAddColumnDialog}>
          <DialogTitle>Add New Column</DialogTitle>
          <DialogContent>
            <TextField
              label="Column Name"
              fullWidth
              variant="outlined"
              margin="normal"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddColumnDialog} sx={{ color: "grey" }}>
              Cancel
            </Button>
            <Button
              onClick={handleAddColumn}
              variant="contained"
              sx={{ backgroundColor: "grey" }}
            >
              Add Column
            </Button>
          </DialogActions>
        </Dialog>

        <Box onContextMenu={handleRightClick}>
          <MaterialReactTable table={table} />
        </Box>
      </Box>
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            // setExportOptionOnRightClick("pdf");
            handleExportOnRightClick("pdf");
            handleClose();
          }}
        >
          Export to PDF
        </MenuItem>
        <MenuItem
          onClick={() => {
            // setExportOptionOnRightClick("excel");
            handleExportOnRightClick("excel");
            handleClose();
          }}
        >
          Export to Excel
        </MenuItem>
      </Menu>
    </>
  );
};

export default TableComponent;
