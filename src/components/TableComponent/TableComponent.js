import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
const TableComponent = ({ excelData, setExcelData }) => {
  const columns = useMemo(
    () =>
      Object.keys(excelData[0]).map((key) => ({
        accessorKey: key,
        header: key,
        size: 50,
        enableEditing: true,
      })),
    [excelData]
  );
  const handleDeleteRow = (rowIndex) => {
    const updatedData = excelData.filter((_, index) => index !== rowIndex);
    updatedData?.length !== 0 && setExcelData(updatedData);
  };

  console.log("kjdkcdsa");
  const openDeleteConfirmModal = (row) => {
    if (excelData.length > 1) {
      if (window.confirm("Are you sure you want to delete this row?")) {
        handleDeleteRow(row.index);
      }
    }
    else{
      alert('The Last Record cannot be deleted')
    }
  };
  const table = useMaterialReactTable({
    columns,
    data: excelData,
    enableEditing: true,
    onEditingRowSave: ({ exitEditingMode, row, values }) => {
      // Implement save logic here
      // Example: updating your data state
      const updatedData = [...excelData];
      updatedData[row.index] = values;
      setExcelData(updatedData); // Ensure props.setData is passed to update the data
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
        backgroundColor: "#818589	",
        color: "#ffffff",
        fontWeight: "bold",
      },
    },
  });
  return <MaterialReactTable table={table} />;
};
export default TableComponent;
