
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Header from '../component/Header';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry } from 'ag-grid-community';
import { ServerSideRowModelModule } from '@ag-grid-enterprise/server-side-row-model';
import { useMemo } from 'react';


ModuleRegistry.register(ServerSideRowModelModule);
//ModuleRegistry.registerModules([ClientSideRowModelModule, RowGroupingModule]);
export default function DisplayData() {

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '600px', width: '100%' }), []);
    const [rowData, setRowData] = useState([]);
    const [paginationPageSize, setPaginationPageSize] = useState(10);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        loadUsers();
    }, [paginationPageSize, paginationCurrentPage]);

    const loadUsers = async () => {
        const result = await axios.get('https://ombn.in/googlesheetconnection/trainee', {
            headers: {
                'sheetId': "1WiZVpFrIsl_Wf_mpAG8LV-ObF2Gmwb8Wjw9Bev6qmY4"
            }
        }
        );
        setRowData(result.data);
        console.log(result.data)
    }

    const columnDefs = [
        { headerName: 'Column 1', field: 'column1' },
        { headerName: 'Column 2', field: 'column2' },
        { headerName: 'Column 3', field: 'column3' },
    ];


    function handlePageSizeChanged(event) {
        setPaginationPageSize(event.target.value);
        setPaginationCurrentPage(1);
    }


    return (
        <>
            <Header />
            <h2>Grid View</h2>
            <div style={containerStyle}>
                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                        paginationPageSize={paginationPageSize}
                        paginationAutoPageSize={true}
                        rowGroupPanelShow={'always'}
                        pagination={true}
                    
                        rowModelType="clientSide"
                        onToolPanelSizeChanged={handlePageSizeChanged}
                    >
                    </AgGridReact>
                </div>
            </div>

        </>
    )
}
