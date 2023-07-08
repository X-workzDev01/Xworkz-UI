import React, { useState } from 'react'
import Header from '../component/Header'
import { Box, Button, Table, TextField } from '@mui/material';
import axios from 'axios';
import { Urlconstant } from '../constant/Urlconstant';
import { AgGridReact } from 'ag-grid-react';

export default function Search() {
  const [searchText, setSearchText] = useState('');
  const [data, setFormData] = useState({});

  const columnDefs = [
    { headerName: 'Trainee Name', field: 'traineeName' },
    { headerName: 'Contact Number', field: 'contactNumber' },
    { headerName: 'Email', field: 'email' },
    { headerName: 'Qualification', field: 'educationInfo.qualification' },
    { headerName: 'Stream', field: 'educationInfo.stream' },
    { headerName: 'Year of Passout', field: 'educationInfo.yearOfPassout' },
    { headerName: 'College Name', field: 'educationInfo.collegeName' },
    { headerName: 'Course', field: 'courseInfo.course' },
    { headerName: 'Branch', field: 'courseInfo.branch' },
    { headerName: 'Batch', field: 'courseInfo.batch' },
    { headerName: 'Referral Name', field: 'referralInfo.referalName' },
    { headerName: 'Referral Contact Number', field: 'referralInfo.referalContactNumber' },
    { headerName: 'Comments', field: 'referralInfo.comments' },
];
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    console.log(searchText)
  };

  const handleSearch = () => {
    const response = axios.get(Urlconstant.url + 'api/' + `filterData?searchValue=${searchText}`, {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      setFormData(response.data)
      console.log(response.data)
    });
  };
  return (
    <div>Search
      <Header />
      <h3>Search</h3>
      <Box display="flex" alignItems="center">
        <TextField
          label="Search"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
        /> &nbsp;&nbsp;&nbsp;
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      <div>
        <AgGridReact
         columnDefs={columnDefs}
          quickFilterText={searchText}
        />

      </div>
    </div>
  )
}
