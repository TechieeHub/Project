import { useMemo } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
const TableComponent = ({excelData,setExcelData}) => {
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
  const table = useMaterialReactTable({
    columns,
    data: excelData,
    enableEditing: true,
    onEditingRowSave: ({ exitEditingMode, row, values }) => {
      // Implement save logic here
      // Example: updating your data state
      const updatedData = [...excelData];
      updatedData[row.index] = values;
      setExcelData(updatedData);  // Ensure props.setData is passed to update the data
      exitEditingMode();  // Close the edit box
    },
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
