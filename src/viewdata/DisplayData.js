import axios from 'axios';
import React, { useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Header from '../component/Header';
import { Urlconstant } from '../constant/Urlconstant';

export default function DisplayData() {
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

    const serverSideDatasource = {
        getRows: (params) => {
            const { startRow, endRow, sortModel } = params.request;
            const response = axios.get(Urlconstant.url + "api/" + `readData?startingIndex=${startRow}&maxRows=${endRow}`, {
                headers: {
                    'spreadsheetId': Urlconstant.spreadsheetId
                }
            }).then((response) => {
                params.successCallback(response.data.sheetsData, response.size);
            }).catch((error) => {
                console.error('Error fetching data:', error);
                params.failCallback();
            });

        },
    };

    return (
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
            <Header />
            <h1>GridView</h1>
            <h1>Trainee Details</h1>
            <AgGridReact
                columnDefs={columnDefs}
                rowModelType="serverSide"
                serverSideDatasource={serverSideDatasource}
                pagination={true}
                paginationAutoPageSize={true}
                defaultColDef={defaultColDef}
                paginationPageSize={10}
                cacheBlockSize={10}
                animateRows={true}
                maxConcurrentDatasourceRequests={1}
            />
        </div>
    );
}