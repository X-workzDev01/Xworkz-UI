import React, { useState } from 'react'
import Header from '../component/Header'
import { Alert, TextField } from '@mui/material';
import axios from 'axios';
import { Urlconstant } from '../constant/Urlconstant';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default function Search() {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [error, setError] = useState();
 
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const onFilterChanged = (event) => {
    const searchText = event.target.value;
    //api call
    axios.get(Urlconstant.url + 'api/' + `filterData?searchValue=${searchText}`, {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      gridApi.setRowData(response.data);
    }).catch(error => {
      setError("data is not loading...")
    });
  };

  const columnDefs = [
    { headerName: 'Trainee Name', field: 'basicInfo.traineeName', cellStyle: { textAlign: 'center' } },
    { headerName: 'Contact Number', field: 'basicInfo.contactNumber', cellStyle: { textAlign: 'center' } },
    { headerName: 'Email', field: 'basicInfo.email', cellStyle: { textAlign: 'center' } },
    { headerName: 'Qualification', field: 'educationInfo.qualification', cellStyle: { textAlign: 'center' } },
    { headerName: 'Stream', field: 'educationInfo.stream', cellStyle: { textAlign: 'center' } },
    { headerName: 'Year of Passout', field: 'educationInfo.yearOfPassout', cellStyle: { textAlign: 'center' } },
    { headerName: 'College Name', field: 'educationInfo.collegeName', cellStyle: { textAlign: 'center' } },
    { headerName: 'Course', field: 'courseInfo.course', cellStyle: { textAlign: 'center' } },
    { headerName: 'Branch', field: 'courseInfo.branch', cellStyle: { textAlign: 'center' } },
    { headerName: 'Batch', field: 'courseInfo.batch', cellStyle: { textAlign: 'center' } },
    { headerName: 'Referral Name', field: 'referralInfo.referalName', cellStyle: { textAlign: 'center' } },
    { headerName: 'Referral Contact Number', field: 'referralInfo.referalContactNumber', cellStyle: { textAlign: 'center' } },
    { headerName: 'Comments', field: 'referralInfo.comments', cellStyle: { textAlign: 'center' } },
  ];
  const defaultColDef = {
    editable: true,
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    floatingFilter: true
  };
  return (
    <div>Search
      <Header />
      <h3>Search</h3>
      <div>
        <div className="ag-search-wrapper">
          <TextField type='text' placeholder='Search ...' onChange={onFilterChanged} />
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
          <AgGridReact onGridReady={onGridReady}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows={true}
            paginationAutoPageSize={true}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      </div>
    </div>
  )
}
