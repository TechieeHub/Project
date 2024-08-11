import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';

const TableComponent = (props) => {
const columns = useMemo(
    () =>  Object.keys(props.data[0]).map((key) => ({
        accessorKey: key,
        header: key,
        size: 50,
      })),
    [props],
  );
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
