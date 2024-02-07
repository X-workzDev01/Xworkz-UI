import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Popover, Typography } from "@mui/material";


const columns = [
  // { headerName: 'ID', field: 'id', flex: 1 },
  { field: 'attemptedOn', headerName: 'Attempted On', width: 150 },
  { field: 'attemptedBy', headerName: 'Attempted By', width: 150 },
  { field: 'attemptStatus', headerName: 'Attempt Status', width: 150 },
  { field: 'callDuration', headerName: 'Call Duration', width: 100 },
  { field: 'callBack', headerName: 'Call Back', width: 150 },
  {
    field: 'comments', headerName: 'Comments', width: 180, renderCell: (params) => {
      const currentRow = params.row.comments;

      return (<BasicPopover comment={currentRow} />);
    }
  }

];

const FollowStatusGrid = ({ rows }) => {

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 100px)',
        margin: '50px',

      }}
    >
      <div style={{ height: 400, width: '60%' }}>
        <DataGrid rows={rows} columns={columns} pageSize={40} />
      </div>
    </div>
  );
};

export default FollowStatusGrid;


function BasicPopover({ comment }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button aria-describedby={id} variant="outlined" onClick={handleClick}>
        View comment
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>{comment}</Typography>
      </Popover>
    </div>
  );
}
