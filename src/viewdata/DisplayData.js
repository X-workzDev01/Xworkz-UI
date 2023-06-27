import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
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
    const [columnApi,setGridColumnApi]=useState();
    const [gridOptions, setGridOptions] = useState({
    });
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
        { headerName: 'Student Name', field: 'studentName' },
        { headerName: 'Email', field: 'email' },
        { headerName: 'Contact Number', field: 'contactNumber' },
        { headerName: 'Address', field: 'address' }
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
                //console.log(startRow,endRow)
                const response =  axios.get(Urlconstant.url+"/api" + `readData?startingIndex=${startRow}&maxRows=${endRow}`, {
                    headers: {
                        'spreadsheetId': Urlconstant.spreadsheetId
                    }
                }).then((response) => {
                    const data=response.data.data;
                    const totalRowCount=response.data.totalRowCount;
                    console.log(data,totalRowCount);
                    setTotalRowCount(response.data.totalRowCount);
                  //  setRowData(response.data.data)
                  //  console.log(params)
                   params.successCallback(response.data, response.data.totalRowCount, params.request);
                    // debugger;
                }).catch((error) => {
                   // params.failCallback();
                    console.error('Error fetching data:', error);
                });

            }

        }
    }
    return (
        <div>
            <Header />
            <h3>grid view</h3>
            <h3>Trainee Details</h3>
            <div className="ag-theme-alpine" id="agGrid">
                <AgGridReact
                    //                   gridOptions={gridOptions}
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
                //                   rowModelType='serverSide'
                />
            </div>
        </div>
    );
}