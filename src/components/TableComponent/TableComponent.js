import { useState, useMemo } from "react";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const TableComponent = ({ excelData, setExcelData,refreshDataHandler }) => {
  const [open, setOpen] = useState(false);
  const [openAddColumnDialog, setOpenAddColumnDialog] = useState(false);
  const [editedColumns, setEditedColumns] = useState({});
  const [tempColumns, setTempColumns] = useState({});
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnValue, setNewColumnValue] = useState("");
  const [exportOption, setExportOption] = useState(""); 

  const handleOpenDialog = () => {
    setTempColumns(editedColumns);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleOpenAddColumnDialog = () => {
    setOpenAddColumnDialog(true);
  };

  const handleCloseAddColumnDialog = () => {
    setOpenAddColumnDialog(false);
  };

  const handleColumnNameChange = (key, newHeader) => {
    setTempColumns((prev) => ({ ...prev, [key]: newHeader }));
  };

  const handleSaveChanges = () => {
    setEditedColumns(tempColumns);
    setOpen(false);
  };

  const handleAddColumn = () => {
    const updatedData = excelData.map((row) => ({
      ...row,
      [newColumnName]: newColumnValue,
    }));

    setExcelData(updatedData);
    setEditedColumns((prev) => ({ ...prev, [newColumnName]: newColumnName }));
    setNewColumnName("");
    setNewColumnValue("");
    setOpenAddColumnDialog(false);
    // refreshDataHandler()
  };

  const handleDeleteColumn = (columnKey) => {
    if (window.confirm('Are you sure you want to delete this column?')) {
      const updatedColumns = { ...editedColumns };
      delete updatedColumns[columnKey];
      setEditedColumns(updatedColumns);

      const updatedData = excelData.map((row) => {
        const { [columnKey]: _, ...rest } = row;
        return rest;
      });

      setExcelData(updatedData);
    }
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
  
      const blob = new Blob([response.data], { type: response.headers["content-type"] });
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
  const columns = useMemo(
    () =>
      Object.keys(excelData[0] || {}).map((key) => ({
        accessorKey: key,
        header: editedColumns[key] || key,
        size: 250,
        enableEditing: true,
      })),
    [excelData, editedColumns]
  );

  const handleDeleteRow = (rowIndex) => {
    const updatedData = excelData.filter((_, index) => index !== rowIndex);
    updatedData?.length !== 0 && setExcelData(updatedData);
  };

  const openDeleteConfirmModal = (row) => {
    if (excelData.length > 1) {
      if (window.confirm("Are you sure you want to delete this row?")) {
        handleDeleteRow(row.index);
      }
    } else {
      alert("The Last Record cannot be deleted");
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: excelData,
    enableEditing: true,
    enableDensityToggle: false,
    onEditingRowSave: ({ exitEditingMode, row, values }) => {
      const updatedData = [...excelData];
      updatedData[row.index] = values;
      setExcelData(updatedData);
      exitEditingMode();
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#818589",
        color: "#ffffff",
        fontWeight: "bold",
      },
    },
  });

  return (
    <>
      <Button
        variant="contained"
        sx={{
          maxHeight: "30px",
          marginLeft: "20px",
          marginTop: "30px",
          backgroundColor: "grey",
        }}
        onClick={handleOpenDialog}
      >
        Edit columns
      </Button>
      <Button
        variant="contained"
        sx={{
          maxHeight: "30px",
          marginLeft: "20px",
          marginTop: "30px",
          backgroundColor: "grey",
        }}
        onClick={handleOpenAddColumnDialog}
      >
        Add Column
      </Button>
      <FormControl sx={{ marginLeft: "20px", marginTop: "30px", minWidth: 120 }}>
        <InputLabel id="export-select-label">Export</InputLabel>
        <Select
          labelId="export-select-label"
          id="export-select"
          value={exportOption}
          label="Export"
          onChange={(e) => setExportOption(e.target.value)}
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
        disabled={!exportOption} // Disable the button if no option is selected
      >
        Export
      </Button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Edit Column Names</DialogTitle>
        <DialogContent>
          {Object.keys(excelData[0] || {}).map((key) => (
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
                value={tempColumns[key] !== undefined ? tempColumns[key] : key}
                onChange={(e) => handleColumnNameChange(key, e.target.value)}
              />
              <IconButton color="error" onClick={() => handleDeleteColumn(key)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: 'grey' }}>Cancel</Button>
          <Button onClick={handleSaveChanges} variant="contained" sx={{ backgroundColor: 'grey' }}>
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
          <Button onClick={handleCloseAddColumnDialog} sx={{ color: 'grey' }}>Cancel</Button>
          <Button onClick={handleAddColumn} variant="contained" sx={{ backgroundColor: 'grey' }}>
            Add Column
          </Button>
        </DialogActions>
      </Dialog>

      <MaterialReactTable table={table} />
    </>
  );
};

export default TableComponent;
