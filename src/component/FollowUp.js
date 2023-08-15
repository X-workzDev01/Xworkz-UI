import React, { useEffect, useState } from 'react'
import { Urlconstant } from '../constant/Urlconstant';
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import EditFollowUp from './EditFollowUp';

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
    const [searchValue, setSearchValue] = useState('');
    useEffect(() => {
        getDropDown();
        setLoading(true);
        searchServerRows(searchValue, paginationModel.page, paginationModel.pageSize)
          .then((newGridData) => {
            setGridData(newGridData);
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
            setGridData({ rows: [], rowCount: 0 });
            setLoading(false);
          });
      }, [paginationModel.page, paginationModel.pageSize, searchValue]);

      const handleSearchClick = () => {
        // Reset the pagination model to initial state
        setPaginationModel({ page: 0, pageSize: initialPageSize });
      };

      function searchServerRows(page, pageSize) {
        const startingIndex = page * pageSize;
        const maxRows = pageSize;
        console.log('Loading server rows with page:', page, 'pageSize:', pageSize, 'status:', searchValue);
        const spreadsheetId = Urlconstant.spreadsheetId; // Replace this with the actual spreadsheet ID
    
        const apiUrl = Urlconstant.url + `api/followUp?startingIndex=${maxRows}&maxRows=10&status=${searchValue}`;
        console.log(apiUrl)
        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            spreadsheetId: spreadsheetId,
          },
        };
        return new Promise((resolve) => {
          fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
              console.log('Received data from server:', data);
              resolve({
                rows: data.followUpData.map((row) => ({ id: row.id.toString(), ...row })), // Merge and set id
                rowCount: data.size, // Set rowCount to the total number of rows (size) in the dataset
              });
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
              resolve({ rows: [], rowCount: 0 }); // Return an empty dataset in case of an error
            });
        });
      }

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
        <h2>FollowUp List</h2>
        <div className="search" style={{ marginTop: '50px', display: 'flex', alignItems: 'center' }}>
       <Select name="statusValues"
         onChange={handleInputChange}
          value={searchValue}
          fullWidth
          required
          id="outlined-basic"
          variant="outlined"
          sx={{
            marginRight: '10px',
            p: '4px', // Adjust padding for a smaller size
            fontSize: '12px', // Adjust font size for a smaller size
          }}
        >
          {dropdown.status.map((item, index) => (
            <MenuItem value={item} key={index}>{item}</MenuItem>
          ))}

        </Select>
       
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
            { field: 'currentlyFollowedBy', headerName: 'Currently FollowedBy', flex: 1, valueGetter: (params) => params.row.currentlyFollowedBy },
            { field: 'currentStatus', headerName: 'Current Status', flex: 1, valueGetter: (params) => params.row.currentStatus },
            { field: 'registrationDate', headerName: 'RegistrationDate', flex: 1, valueGetter: (params) => params.row.registrationDate },
            {
              field: 'actions',
              headerName: 'Actions',
              width: 120,
              renderCell: (params) => (
                <Button variant="outlined" color="primary" onClick={() => handleEditClick(params.row)}>
                  Edit
                </Button>
              ),
            }
          ]}
          rows={gridData.rows}
          pagination
          paginationModel={paginationModel}
          pageSizeOptions={[5, 10, 15]}
          rowCount={gridData.rowCount}
          onPaginationModelChange={setPaginationModel}
          loading={loading}
        />
        <EditFollowUp
        open={isModalOpen}
        handleClose={() => setModalOpen(false)}
        rowData={editedRowData}
        setRowData={setEditedRowData}
        handleSaveClick={handleSaveClick}
      />
        </div>
    </div>
  )
}