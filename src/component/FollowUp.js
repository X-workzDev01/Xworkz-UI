import React, { useEffect, useState } from 'react'
import { Urlconstant } from '../constant/Urlconstant';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField, debounce } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import EditFollowUp from './EditFollowUp';
import { Link } from 'react-router-dom';

export default function FollowUp() {
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editedRowData, setEditedRowData] = React.useState(null);
  const [dropdown, setDropDown] = useState({
    status: [],
  });

  const initialPageSize = 10;
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = useState({
    rows: [],
    rowCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('New');

  React.useEffect(() => {
    getDropDown();
    setLoading(true);
    // When searchValue changes, we need to reset the page back to 0
    setPaginationModel({ page: 0, pageSize: initialPageSize });

    // Fetch data with updated searchValue
    searchServerRows(0, initialPageSize).then((newGridData) => {
      setGridData(newGridData);
      setLoading(false);
    });
  }, [searchValue]);


  React.useEffect(() => {
    setLoading(true);
    searchServerRows(paginationModel.page, paginationModel.pageSize).then((newGridData) => {
      setGridData(newGridData);
      setLoading(false);
    });
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleSearchClick = () => {
    setPaginationModel({ page: 0, pageSize: initialPageSize });
    setSearchValue(searchValue);
  };

  function searchServerRows(page, pageSize) {
    const startingIndex = page * pageSize;
    console.log('Loading server rows with page:', page, 'pageSize:', pageSize, 'status:', searchValue);
    const spreadsheetId = Urlconstant.spreadsheetId; // Replace this with the actual spreadsheet ID

    const apiUrl = Urlconstant.url + `api/followUp?startingIndex=${startingIndex}&maxRows=10&status=${searchValue}`;

    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        spreadsheetId: spreadsheetId,
      },
    };
    return new Promise((resolve, reject) => {
      fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log('Received data from server:', data);
          const newGridData = {
            rows: data.followUpData.map((row) => ({ id: row.id.toString(), ...row })),
            rowCount: data.size,
          };
          resolve(newGridData);
        }, 1000)
        .catch((error) => {
          console.error('Error fetching data:', error);
          resolve({ rows: [], rowCount: 0 }); // Return an empty dataset in case of an error
        });
    });
  };




  const handleEditClick = (row) => {
    setEditedRowData(row);
    setModalOpen(true);
  };

  const handleSaveClick = () => {
    // Perform save operation here with editedRowData
    console.log('Edited Data:', editedRowData);
    // After saving, you may want to update the grid data or reload the data to reflect the changes
    setModalOpen(false);
  };

  const getDropDown = () => {
    axios.get(Urlconstant.url + 'utils/dropdown', {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      setDropDown(response.data)
    }).catch(error => {
      console.log(error);
    })
  }
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    console.log(e.target.value)
  };

  return (
    <div>
      <h2>VeiwFollowUp</h2>
      {/* <h2>FollowUp List</h2> */}
      <div className="search" style={{ marginTop: '50px', display: 'flex', alignItems: 'center' }}>

        <FormControl>
          <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Status Values"
            onChange={handleInputChange}
            value={searchValue}
            fullWidth
            required
            variant="outlined"
            sx={{
              marginRight: '10px',
              width: '200px', // Adjust padding for a smaller size
              fontSize: '12px', // Adjust font size for a smaller size
            }}
          >
            {dropdown.status.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}

          </Select>
        </FormControl>

      </div>
      <div style={{ height: '650px', width: '100%' }}>
        <DataGrid
          columns={[
            { headerName: 'ID', field: 'id', flex: 1 },
            { field: 'traineeName', headerName: 'Trainee Name', flex: 1, valueGetter: (params) => params.row.basicInfo.traineeName },
            { field: 'email', headerName: 'Email', flex: 1, valueGetter: (params) => params.row.basicInfo.email },
            { field: 'contactNumber', headerName: 'Contact Number', flex: 1, valueGetter: (params) => params.row.basicInfo.contactNumber },
            { field: 'joiningDate', headerName: 'Joining Date', flex: 1, valueGetter: (params) => params.row.joiningDate },
            { field: 'courseName', headerName: 'Course Name', flex: 1, valueGetter: (params) => params.row.courseName },
            { field: 'currentStatus', headerName: 'Current Status', flex: 1, valueGetter: (params) => params.row.currentStatus },
            { field: 'registrationDate', headerName: 'RegistrationDate', flex: 1, valueGetter: (params) => params.row.registrationDate },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 120,
              renderCell: (params) => (
                <div>
                  <Button
                    variant="outlined"
                    color="secondary"
                    component={Link} // Use Link component for navigation
                    to={`/x-workz/profile/${params.row.basicInfo.email}`}
                  // Pass email as a parameter
                  >
                    View
                  </Button>
                </div>

              ),
            }

          ]}
          rows={gridData.rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15]}
          rowCount={gridData.rowCount}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          loading={loading}
          keepNonExistentRowsSelected

        />
        <EditFollowUp
          open={isModalOpen}
          handleClose={() => setModalOpen(false)}
          rowData={editedRowData}
          setRowData={setEditedRowData}
          handleSaveClick={handleSaveClick}
          dropdown={dropdown}
        />
      </div>
    </div>
  )
}
