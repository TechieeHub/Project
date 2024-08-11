import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

const TableComponent = (props) => {
const columns = useMemo(
    () =>  Object.keys(props.data[0]).map((key) => ({
        accessorKey: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
        size: 50,
      })),
    [],
  );
  // const table = useMaterialReactTable({
  //   columns,
  //   data:props.data,
  // });

  const table = useMaterialReactTable({
    columns,
    data: props.data,
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#818589	', // Header background color
        color: '#ffffff', // Header text color
        fontWeight: 'bold',
      },
    },
  });

  return <MaterialReactTable table={table} />;
};

export default TableComponent;
