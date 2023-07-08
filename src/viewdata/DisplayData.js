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
    const [rowData, setRowData] = useState();
    const [totalRowCount, setTotalRowCount] = useState()
    const [gridApi, setGridApi] = useState(null);
    const [columnApi, setGridColumnApi] = useState();

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const defaultColDef = useMemo(() => {
        return {
            editable: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            floatingFilter: true
        };
    }, [])
    
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
    const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
        params.api.setServerSideDatasource(createServerSideDatasource(params.api));

    }
    //console.log(rowData)
    const createServerSideDatasource = () => {
        return {
            getRows: (params) => {
                const { startRow, endRow } = params.request;
                const response = axios.get(Urlconstant.url + "api/" + `readData?startingIndex=${startRow}&maxRows=${endRow}`, {
                    headers: {
                        'spreadsheetId': Urlconstant.spreadsheetId
                    }
                }).then((response) => {
                    const totalRowCount = response.data.size;
                    setTotalRowCount(totalRowCount);
                    params.successCallback(response.data.sheetsData, totalRowCount);
                    console.log(response.data.sheetsData)
                })
                    .catch((error) => {
                        console.error('Error fetching data:', error);
                        params.failCallback();
                    });
            }
        }
    }
    return (
        <div>
            <Header />
            <h3>grid view</h3>
            <h3>Trainee Details</h3>
            <div style={containerStyle}>
                <div style={gridStyle} className="ag-theme-alpine-dark">
                    <div className="ag-theme-alpine" id="agGrid">
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={rowData}
                            pagination={true}
                            paginationPageSize={10}
                            cacheBlockSize={10}
                            serverSideDatasource={true}
                            animateRows={true}
                            rowModelType='serverSide'
                            paginationOverflowSize={10}
                            onGridReady={onGridReady}
                            maxConcurrentDatasourceRequests={1}
                            defaultColDef={defaultColDef}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}