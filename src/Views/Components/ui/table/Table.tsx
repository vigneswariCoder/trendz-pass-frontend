import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import './table.css';

interface TableProps {
  rows: any[];
  columns: GridColDef[];
  pinnedColumns?: {
    left: string[];
    right: string[];
  };
}

const Table: React.FC<TableProps> = ({ rows, columns, pinnedColumns }) => {
  // const pinnedColumnIds = React.useMemo(() => {
  //   const left = pinnedColumns?.left || [];
  //   const right = pinnedColumns?.right || [];
  //   return [...left, ...right];
  // }, [pinnedColumns]);

  return (
    <div className='mui-grid-table' style={{ height: !rows || rows.length === 0 ? 300 : '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 6 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
      // columnBufferPx={columns.length * 1100}
      // columnVisibilityModel={{
      //   ...Object.fromEntries(
      //     pinnedColumnIds.map(id => [id, true])
      //   )
      // }}
      />
    </div>
  );
};

export default Table;
