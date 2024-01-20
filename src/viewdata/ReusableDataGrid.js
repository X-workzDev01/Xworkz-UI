// import React from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import EditModal from './EditModal';

// function ReusableDataGrid({
//   columns,
//   rows,
//   paginationModel,
//   setPaginationModel,
//   rowSelectionModel,
//   setRowSelectionModel,
//   loading,
//   handleEditClick,
//   searchValue,
//   handleSaveClick,
//   isModalOpen,
//   editedRowData,

//   //these are the props which are need to be sent while using this components
//   //these functions , please check about these fuctions in TraineeTable component
// }) {
//   return (
//     <div style={{ height: '650px', width: '100%' }}>
//       <DataGrid
//         columns={columns}
//         rows={rows}
//         pagination
//         paginationModel={paginationModel}
//         pageSizeOptions={[5, 10, 15]}
//         rowCount={rows.length}
//         paginationMode={searchValue === '' ? 'server' : 'client'}
//         onPaginationModelChange={setPaginationModel}
//         onRowSelectionModelChange={setRowSelectionModel}
//         rowSelectionModel={rowSelectionModel}
//         loading={loading}

//         keepNonExistentRowsSelected
//       />
//       <EditModal
//         open={isModalOpen}
//         handleClose={() => setModalOpen(false)}
//         rowData={editedRowData}
//         handleSaveClick={handleSaveClick}
//       />
//     </div>
//   );
// }

// export default ReusableDataGrid;
