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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const TableComponent = ({ excelData, setExcelData }) => {
  const [open, setOpen] = useState(false);
  const [editedColumns, setEditedColumns] = useState({});
  const [tempColumns, setTempColumns] = useState({}); // Temporary state for editing

  const handleOpenDialog = () => {
    setTempColumns(editedColumns); // Copy the current edited columns to temp state
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleColumnNameChange = (key, newHeader) => {
    console.log('newHeader',newHeader)
    setTempColumns((prev) => ({ ...prev, [key]: newHeader }));
  };

  const handleSaveChanges = () => {
    setEditedColumns(tempColumns); // Commit the changes from temp to the main state
    setOpen(false);
  };

  const columns = useMemo(
    () =>
      Object.keys(excelData[0]).map((key) => ({
        accessorKey: key,
        header: editedColumns[key] || key, // Use the edited column name if available
        size: 50,
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
    enableDensityToggle:false,
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
        sx={{ maxHeight: "30px", marginLeft: "20px", marginTop: "30px" }}
        onClick={handleOpenDialog}
      >
        Edit columns
      </Button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Edit Column Names</DialogTitle>
        <DialogContent>
          {Object.keys(excelData[0]).map((key) => (
            <TextField
              key={key}
              label={`Edit ${key}`}
              fullWidth
              variant="outlined"
              margin="normal"
              value={tempColumns[key] !== undefined ? tempColumns[key] : key}
              onChange={(e) => handleColumnNameChange(key, e.target.value)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveChanges} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <MaterialReactTable table={table} />
    </>
  );
};

export default TableComponent;
