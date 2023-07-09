import axios from 'axios';
import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Header from '../component/Header';
import { Urlconstant } from '../constant/Urlconstant';

export default function DisplayData() {
    const[rowData,setRowData] =useState();
    
    
    const columnDefs = [
        { headerName: 'Trainee Name', field: 'basicInfo.traineeName' },
        { headerName: 'Contact Number', field: 'basicInfo.contactNumber' },
        { headerName: 'Email', field: 'basicInfo.email' },
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
    const defaultColDef = {
        editable: true,
        sortable: true,
        filter: true,
        resizable: true,
        flex: 1,
        floatingFilter: true
      };
      
        const serverSideDatasource = {
          getRows: (params) => {
            const { startRow, endRow, sortModel } = params.request;
            const response = axios.get(Urlconstant.url + "api/" + `readData?startingIndex=${startRow}&maxRows=${endRow}`, {
                headers: {
                    'spreadsheetId': Urlconstant.spreadsheetId
                }
            }).then((response)=>{
                params.successCallback(response.data.sheetsData, response.size);
            }).catch((error) => {
                console.error('Error fetching data:', error);
                params.failCallback();
              });
            
          },
        };
         
    return (
    
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
            <h3>GridView</h3>
            <h1>Trainee Details</h1>
      <AgGridReact
        columnDefs={columnDefs}
        rowModelType="serverSide"
        serverSideDatasource={serverSideDatasource}
        pagination={true}
        paginationAutoPageSize={true}
        defaultColDef={defaultColDef}
        paginationPageSize={12}
        cacheBlockSize={10}

      />
    </div>
    );
}