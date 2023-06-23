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
        { field: 'studentName' },
        { field: 'email' },
        { field: 'contactNumber' },
        { field: 'address' }
    ];
    const onGridReady = (params) => {
        setGridApi(params.api);
        params.api.setServerSideDatasource(createServerSideDatasource());

    }
    const createServerSideDatasource = () => {
        return {
            getRows: (params) => {
                const { startRow, endRow } = params.request;
                axios.get(Urlconstant.url + `utils/page?startIndex=${startRow}&endIndex=${endRow}`, {
                    headers: {
                        'spreadsheetId': Urlconstant.spreadsheetId
                    }
                }).then((response) => {
                    console.log(response.data.totalRowCount)
                    setTotalRowCount(response.data.totalRowCount);
                    params.successCallback(response.data,response.data.totalRowCount);
                }).catch((error) => {
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
            <div className="ag-theme-alpine" id="agGrid">
                <AgGridReact
                    //                   gridOptions={gridOptions}
                    columnDefs={columnDefs}
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
    );
}