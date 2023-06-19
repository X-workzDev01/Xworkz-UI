import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Header from '../component/Header';

export default function DisplayData() {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [totalRowCount, setTotalRowCount] = useState(0);

    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);

    const columnDefs = [
        { field: 'studentName' },
        { field: 'email' },
        { field: 'contactNumber' },
        { field: 'address' }
    ];

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async (params = {}) => {
        console.log("inside fetch data",params.value)
        try {
            const response = await axios.get(`http://localhost:8080/connection/trainees/page?startIndex=${10}&endIndex=${20}`, {
                headers: {
                    sheetId: "1WiZVpFrIsl_Wf_mpAG8LV-ObF2Gmwb8Wjw9Bev6qmY4",
                }
            });
            setRowData(response.data);
            //here we have to set the total count we will get total count from the back end
            setTotalRowCount(100)
            if (gridApi) {
                gridApi.paginationSetTotalRows();
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onGridReady = (params) => {
        setGridApi(params.api);
       // setGridColumnApi(params.columnApi);
        params.api.setServerSideDatasource({
            getRows: (params) => {
                fetchData(params);
            },
        });
    };
    const defaultColDef = useMemo(() => {
        return {
            editable: true,
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            floatingFilter: true
        };
    }, []);

    const formatPaginationNumber = (params) => {        
          return `${params.value} (${totalRowCount})`;
      };
      
    return (
        <div style={containerStyle}>
            <Header />
            <h3>grid view</h3>
            <div className="ag-theme-alpine">
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    onGridReady={onGridReady}
                    domLayout='autoHeight'
                    animateRows={true}
                   serverSideDatasource={true}
                   paginationNumberFormatter={formatPaginationNumber}
                />
            </div>
        </div>
    );
}
