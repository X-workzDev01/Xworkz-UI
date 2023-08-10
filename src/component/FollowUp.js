import React, { useEffect, useState } from 'react'
import { Urlconstant } from '../constant/Urlconstant';
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import EditFollowUp from './EditFollowUp';

export default function FollowUp() {
  const initialPageSize = 10; // Set the initial page size for server-side pagination

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: initialPageSize,
  });
  const [gridData, setGridData] = React.useState({
    rows: [],
    rowCount: 0,
  });
  const [loading, setLoading] = React.useState(false);
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [editedRowData, setEditedRowData] = React.useState(null);

  const [statusValues, setStatusValues] = useState();




  const handleSaveClick = () => {
    // Perform save operation here with editedRowData
    console.log('Edited Data:', editedRowData);
    // After saving, you may want to update the grid data or reload the data to reflect the changes
    setModalOpen(false);
  };



  function loadServerRows(page, pageSize) {
    const startingIndex = page * pageSize;
    const maxRows = pageSize;
    console.log('Loading server rows with page:', page, 'pageSize:', pageSize, 'status:', statusValues);
    const spreadsheetId = Urlconstant.spreadsheetId; // Replace this with the actual spreadsheet ID

    const apiUrl = Urlconstant.url + `api/followUp?startingIndex=${startingIndex}&maxRows=${maxRows}&status=${statusValues}`;
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

  const handleStatus = () => {
    setLoading(true);
    setPaginationModel((prevPaginationModel) => ({ ...prevPaginationModel, page: 0 }));
    loadServerRows(0, paginationModel.pageSize)
      .then((data) => {
        setGridData(data);
        setLoading(false);
      });
  }

  const handleEditClick = (row) => {
    setEditedRowData(row);
    setModalOpen(true);
    //console.log(row);
   // alert(row)
  };

  const [dropdown, setDropDown] = useState({
    status: [],
  });

  useEffect(() => {
    getDropDown();
  }, []);

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
    setStatusValues(e.target.value);
    console.log(e.target.value)
  };
  return (
    <div>
      <div className="search" style={{ display: 'flex', alignItems: 'center', marginTop: '100px' }}>

        <Select name="statusValues"
          onChange={handleInputChange}
          value={statusValues}
          fullWidth
          required
          id="outlined-basic"
          variant="outlined"
        >
          {dropdown.status.map((item, index) => (
            <MenuItem value={item} key={index}>{item}</MenuItem>
          ))}

        </Select>
        <Button variant="contained" color="primary" onClick={handleStatus}>
          Search
        </Button>
      </div>
      <div style={{ marginTop: '20px' }}>
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
          rowCount={gridData.rowCount}
          loading={loading}
          keepNonExistentRowsSelected
          onPaginationModelChange={setPaginationModel}
          paginationMode="server" // Set pagination mode to 'server'
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          // onPageChange={(newPage) => {
          //   console.log('New page:', newPage);

          //   setLoading(true);
          //   setPaginationModel((prevPaginationModel) => ({
          //     ...prevPaginationModel,
          //     page: newPage,
          //   }));

          //   loadServerRows(newPage, paginationModel.pageSize)
          //     .then((data) => {
          //       console.log('Received data for new page:', data);
          //       setGridData(data);
          //       setLoading(false);
          //     });
          // }}
          onPageChange={async (newPage) => {
            setLoading(true);
            setPaginationModel((prevPaginationModel) => ({
              ...prevPaginationModel,
              page: newPage,
            }));

            try {
              const data = await loadServerRows(newPage, paginationModel.pageSize);
              setGridData(data);
            } catch (error) {
              console.error('Error loading data for new page:', error);
              setGridData({ rows: [], rowCount: 0 });
            } finally {
              setLoading(false);
            }
          }}
          pageSizeOptions={[5, 10, 25]}
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
