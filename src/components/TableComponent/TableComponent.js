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
import AddIcon from "@mui/icons-material/Add";

const TableComponent = ({ excelData, setExcelData }) => {
  const [open, setOpen] = useState(false);
  const [openAddColumnDialog, setOpenAddColumnDialog] = useState(false);
  const [editedColumns, setEditedColumns] = useState({});
  const [tempColumns, setTempColumns] = useState({});
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnValue, setNewColumnValue] = useState("");

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
    const columnNameMapping = { ...editedColumns };

    // const updatedData = excelData.map((row) => {
    //   const updatedRow = {};
    //   Object.keys(row).forEach((oldKey) => {
    //     const newKey = columnNameMapping[oldKey] || oldKey;
    //     updatedRow[newKey] = row[oldKey];
    //   });
    //   return updatedRow;
    // });

    // setExcelData(updatedData);
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
  console.log("excenjnhj", excelData);
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
        sx={{ maxHeight: "30px", marginLeft: "20px", marginTop: "30px" , backgroundColor: 'grey'}}
        onClick={handleOpenDialog}
      >
        Edit columns
      </Button>
      <Button
        variant="contained"
        sx={{ maxHeight: "30px", marginLeft: "20px", marginTop: "30px" ,backgroundColor: 'grey'}}
        onClick={handleOpenAddColumnDialog}
      >
        Add Column
      </Button>

      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Edit Column Names</DialogTitle>
        <DialogContent>
          {Object.keys(excelData[0] || {}).map((key) => (
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
          {/* <TextField
            label="Default Value"
            fullWidth
            variant="outlined"
            margin="normal"
            value={newColumnValue}
            onChange={(e) => setNewColumnValue(e.target.value)}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddColumnDialog}>Cancel</Button>
          <Button onClick={handleAddColumn} variant="contained">
            Add Column
          </Button>
        </DialogActions>
      </Dialog>

      <MaterialReactTable table={table} />
    </>
  );
};

export default TableComponent;
