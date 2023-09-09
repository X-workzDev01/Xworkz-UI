import React from 'react';
import { DataGrid } from '@mui/x-data-grid';


const columns = [
  { headerName: 'ID', field: 'id', flex: 1 },
  { field: 'attemptedOn', headerName: 'Attempted On', width: 150 },
  { field: 'attemptedBy', headerName: 'Attempted By', width: 150 },
  { field: 'attemptStatus', headerName: 'Attempt Status', width: 150 },
  { field: 'callDuration', headerName: 'Call Duration', width: 100 },
  { field: 'callBack', headerName: 'Call Back', width: 150 },
  { field: 'comments', headerName: 'Comments', width: 200 },
  { field: 'prefferedLocation', headerName: 'Preferred Location', width: 200 },
  { field: 'prefferedClassType', headerName: 'preffered Class Type', width: 200 },
];

const FollowStatusGrid = ({rows}) => {
    
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 100px)', // Adjust the height as needed
        margin: '50px',
      
      }}
    >
    <div style={{ height: 400, width: '75%'}}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
    </div>
  );
};

export default FollowStatusGrid;
