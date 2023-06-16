import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Header from '../component/Header';

export default function DisplayData() {
    const [gridApi, setGridApi] = useState(null);
    //const [columnDefs, setColumnDefs] = useState([]);
    const [rowData, setRowData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [count, setCount] = useState(10);
    const [previousCount, setPreviousCount] = useState(1);

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '600px', width: '100%' }), []);
    const columnDefs = [
        { field: 'studentName' },
        { field: 'email' },
        { field: 'contactNumber' },
        { field: 'address' }
    ];

    useEffect(() => {
        fetchData();
        getData();
    }, [currentPage, pageSize]);

    const getData = () => {
        axios.get(`http://localhost:8080/connection/trainee/alldata`, {
            headers: {
                sheetId: "1WiZVpFrIsl_Wf_mpAG8LV-ObF2Gmwb8Wjw9Bev6qmY4",
            }
        }).then(response => {
            setTotalRecords(response.data.length);
            setPageSize(response.data.length)
        })
    }

    const fetchData = () => {
        // Calculate the start index based on current page and page size
        console.log(currentPage)
        console.log(pageSize)
        const startIndex = (currentPage - 1) * pageSize;
        axios.get(`http://localhost:8080/connection/trainees/page?startIndex=${startIndex}&endIndex=${pageSize}`, {
            headers: {
                sheetId: "1WiZVpFrIsl_Wf_mpAG8LV-ObF2Gmwb8Wjw9Bev6qmY4",
            }
        })
            .then(response => {
                //const { data, total } = response.data;
                setRowData(response.data);

            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    const onGridReady = params => {
        setGridApi(params.api);
    };

    const defaultColDef = useMemo(() => {
        return {
            editable: true,
            sortable: true,
            filter: true,
            resizable: true,
        };
    }, []);
    const handlePaginationChanged = (event) => {
        const newPage = event.api.paginationGetCurrentPage() + 1;
        setCurrentPage(newPage);
    };
    console.log(previousCount, count)


    return (
        <div style={containerStyle}>
            <Header/>
            <h3>grid view</h3>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    onGridReady={onGridReady}
                    serverSideStoreType={'partial'}
                    //onPaginationChanged={params => handlePageChange(params.api.paginationGetCurrentPage() + 1)}
                    suppressCellSelection={true}
                    cacheBlockSize={10}
                    maxBlocksInCache={2}
                    animateRows={true}
                    onPaginationChanged={handlePaginationChanged}

                />
            </div>
        </div>

    );
}

