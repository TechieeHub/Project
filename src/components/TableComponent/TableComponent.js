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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const TableComponent = ({ excelData, setExcelData,deletedColumns, refreshDataHandler }) => {
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
    handleEditColumnName(tempColumns)
    setOpen(false);
  };

  console.log("yutyutyu", deletedColumns);
  const handleAddColumn = () => {
    const updatedData = excelData.map((row) => ({
      ...row,
      [newColumnName]: newColumnValue,
    }));
    addNewColumnHandler(newColumnName);
    // setExcelData(updatedData);
    setEditedColumns((prev) => ({ ...prev, [newColumnName]: newColumnName }));
    setNewColumnName("");
    setNewColumnValue("");
    setOpenAddColumnDialog(false);
  };

  const handleDeleteColumn = (columnKey) => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      // const updatedColumns = { ...editedColumns };

      handleSoftDeleteColumn(columnKey)
      // delete updatedColumns[columnKey];
      // setEditedColumns(updatedColumns);

      // const updatedData = excelData.map((row) => {
      //   const { [columnKey]: _, ...rest } = row;
      //   return rest;
      // });

      // setExcelData(updatedData);
    }
  };

  //Ishan
  // const handleDeleteColumn = (columnKey) => {
  //   if (window.confirm('Are you sure you want to delete this column?')) {
  //     const updatedColumns = { ...editedColumns };
  //     delete updatedColumns[columnKey];
  //     setEditedColumns(updatedColumns);

  //     const updatedData = excelData.map((row) => {
  //       const { [columnKey]: _, ...rest } = row;
  //       return rest;
  //     });

  //     setExcelData(updatedData);
  //   }
  // };

 const  handleSoftDeleteColumn=(data)=>{
  const apidata={
      column_name: data
  }
  axios
  .post("http://localhost:8000/api/soft-delete-column/", apidata)
  .then((response) => refreshDataHandler(true))
  .catch((error) => alert("Something went wrong"));
  }

  const  handleEditColumnName=(data)=>{

    const apidata={
        old_column_name: Object.keys(data)[0],
    new_column_name: Object.values(data)[0]
    }
    axios
    .post("http://localhost:8000/api/rename-column/", apidata)
    .then((response) => refreshDataHandler(true))
    .catch((error) => console.log("Old and new Name are Same"));
    }
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
  const columns = useMemo(
    () =>
      Object.keys(excelData[0] || {}).map((key) => ({
        accessorKey: key,
        header: editedColumns[key] || key,
        size: 250,
        // enableEditing: true,
        enableEditing: key !== "_id",
        muiTableBodyCellProps: () => ({
          sx: {
            backgroundColor: deletedColumns.includes(key) ? '#FFB7C5' : 'transparent', 
            color: deletedColumns.includes(key) ? 'black' : 'black', 
            opacity: deletedColumns.includes(key) ? 0.8 : 1,
          },
        }),
        isVisible: key !== ("_id" && 'is_deleted'),
        // isVisible: key !== "_id" && key !== "is_deleted",
      })),
    [excelData, editedColumns,deletedColumns]
  );
  // const visibleColumns = columns.filter((column) => column.isVisible);

  const handleDeleteRow = (rowIndex) => {
    const updatedData = excelData.filter((_, index) => index !== rowIndex);
    updatedData?.length !== 0 && setExcelData(updatedData);
  };

  const openDeleteConfirmModal = (row) => {
    if (excelData.length > 1) {
      if (window.confirm("Are you sure you want to delete this row?")) {
        // handleDeleteRow(row.index);
        deleteRowHandler(row.original._id);
      }
    } else {
      alert("The Last Record cannot be deleted");
    }
  };

  const editRowHandler = (data) => {
    const { _id, ...dataWithoutId } = data
    const areAllValuesBlank = Object.values(dataWithoutId).every(value => 
      value === '' || value === ' ' || value == null
    );
    if(data._id)
    {
      axios
      .post(
        `http://localhost:8000/api/create_or_update_record/${data._id}/`,
        dataWithoutId
      )
      .then((response) => refreshDataHandler(true))
      .catch((error) => console.log("error", error));
    }
    else{
      axios
      .post(
        `http://localhost:8000/api/create_or_update_record/`,dataWithoutId
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
      // setExcelData([...excelData, newRow]);
      setExcelData([newRow, ...excelData]); 
    }
  };

  const filteredData = useMemo(() => 
    excelData.filter(row => !row.is_deleted), 
    [excelData]
  );

  const filteredColumn=columns?.filter(data=>!deletedColumns.includes(data?.accessorKey))
  const table = useMaterialReactTable({
    columns:filteredColumn,
    initialState: { columnVisibility: {'_id': false,'is_deleted': false } },
    data: filteredData,
    enableEditing: true,
    enableDensityToggle: false,
    enableColumnOrdering: true,
    // onColumnOrderChange can be used to perform any action on Column order change
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
        fontWeight: "bold",
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.original.is_deleted && "#F8C8DC",
        opacity:row.original.is_deleted && 0.8
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
      <Button
            onClick={handleAddRow}
            variant="contained"
            sx={{
              maxHeight: "30px",
              marginLeft: "20px",
              marginTop: "30px",
              backgroundColor: "grey",
            }}
          >
            Add New Row
          </Button>
      
      <FormControl sx={{ marginLeft: "20px", marginTop: "30px", minWidth: 120 }}>
  <InputLabel 
   sx={{
    fontSize: "14px",  // Reduce the font size of the label
    lineHeight: "1.2", // Adjust the line height if needed
    transform: "translate(14px, 8px) scale(1)", // Adjust label position
  }}
  id="export-select-label">Export</InputLabel>
  <Select
    labelId="export-select-label"
    id="export-select"
    value={exportOption}
    label="Export"
    onChange={(e) => setExportOption(e.target.value)}
    sx={{
      height: "30px",  // Set the height of the select box
      minHeight: "30px",  // Ensure the minimum height is consistent
      fontSize: "14px",  // Optional: Adjust font size to fit within the reduced height
      paddingTop: "2px", // Optional: Adjust padding to vertically center the text
      paddingBottom: "2px", // Optional: Adjust padding to vertically center the text
    }}
    MenuProps={{
      PaperProps: {
        sx: {
          maxHeight: 200, // Limit the dropdown height
          '& .MuiMenuItem-root': {
            fontSize: '14px', // Adjust font size for menu items
            padding: '4px 8px', // Reduce padding for menu items
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
        disabled={!exportOption} // Disable the button if no option is selected
      >
        Export
      </Button>
      <Dialog open={open} onClose={handleCloseDialog}>
  <DialogTitle>Edit Column Names</DialogTitle>
  <DialogContent>
    {Object.keys(excelData[0] || {}).filter((key) => key!=="_id")
      .filter((key) => !deletedColumns.includes(key)) // Filter out deleted columns
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

      <MaterialReactTable table={table} />
    </>
  );
};

export default TableComponent;