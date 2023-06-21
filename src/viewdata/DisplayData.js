import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Header from '../component/Header';
import { Grid, GridOptionsService } from 'ag-grid-enterprise';

export default function DisplayData() {
    const [rowData, setRowData] = useState();
    const [totalRowCount, setTotalRowCount] = useState(100)
    const [gridOptions, setGridOptions] = useState({
        columnDefs: [
            { field: 'studentName' },
            { field: 'email' },
            { field: 'contactNumber' },
            { field: 'address' }
        ],
        defaultColDef: useMemo(() => {
            return {
                editable: true,
                sortable: true,
                filter: true,
                resizable: true,
                flex: 1,
                floatingFilter: true
            };
        }, []),
        
        pagination: true,
        paginationPageSize: 10,
        cacheBlockSize: 10,
        serverSideDatasource:true,
        rowModelType: 'serverSide',
        onGridReady: (params) => {
            params.api.setServerSideDatasource(createServerSideDatasource());
        },
    });


    const createServerSideDatasource = () => {
        let stopLoading = false;
        return {
            getRows: (params) => {
                const { startRow, endRow } = params.request;
                console.log(startRow,endRow)
                if (stopLoading) {
                    return;
                  }
                setTimeout(() => {
                const response = axios.get(`http://localhost:8080/connection/trainees/page?startIndex=${startRow}&endIndex=${endRow}`, {
                    headers: {
                        sheetId: "1WiZVpFrIsl_Wf_mpAG8LV-ObF2Gmwb8Wjw9Bev6qmY4",
                    }
                }).then((response) => {
                    const data = response.data;
                    setTotalRowCount(response.totalRowCount);
                    setRowData(response.data)
                    params.successCallback(data, totalRowCount);
                    if (totalRowCount <= endRow) {
                        stopLoading = true; // Set the flag to stop further loading
                      }
                }).catch((error) => {

                    params.failCallback();
                    console.error('Error fetching data:', error);
                });
            },1000);
            }

        }

    }
    return (
        <div>
            <Header />
            <h3>grid view</h3>
            <div className="ag-theme-alpine" id="agGrid">
                <AgGridReact
                    gridOptions={gridOptions}
                    rowData= {rowData}
                />
            </div>
        </div>
    );
}