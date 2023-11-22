import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { Urlconstant } from '../constant/Urlconstant';
import { PersonOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';



export default function ViewClient() {
    const [rowData, setRowData] = React.useState([]);
    const initialPageSize = 25;
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: initialPageSize,
    });
    const [gridData, setGridData] = React.useState({
        rows: [],
        rowCount: 0,
    });

    React.useEffect(() => {
        searchServerRows(paginationModel.page, paginationModel.pageSize).then(
            (newGridData) => {
                setGridData(newGridData);
            }
        );
        //filterData();
    }, [
        paginationModel.page,
        paginationModel.pageSize
    ]);
    function searchServerRows(page, pageSize) {
        const startingIndex = page * pageSize;
        var apiUrl;
        apiUrl =
            Urlconstant.url +
            `api/readclientinfomation?startingIndex=${startingIndex}&maxRows=25`;
        return new Promise((resolve) => {
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    console.log("Received data from server:", data);

                    const newGridData = {
                        rows: data.clientData.map((row) => ({
                            id: row.id.toString(),
                            ...row,
                        })),
                        rowCount: data.size,
                    };

                    resolve(newGridData);
                }, 1000)

                .catch((error) => {
                    resolve({ rows: [], rowCount: 0 });
                });
        });
    }

    const column = [
        { headerName: 'ID', field: 'id' },
        {
            field: "companyName",
            headerName: "Company Name",
            flex: 1,
            valueGetter: (params) => params.row.companyName,
        },
        {
            field: "companyEmail",
            headerName: "Company E-mail",
            flex: 1,
            valueGetter: (params) => params.row.companyEmail,
        },
        {
            field: "companyLocation",
            headerName: "Location",
            flex: 1,
            valueGetter: (params) => params.row.companyLocation,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            valueGetter: (params) => params.row.status,
        },
        {
            field: "companyWebsite",
            headerName: "Company Website",
            flex: 1,
            valueGetter: (params) => params.row.companyWebsite,
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 120,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<PersonOutline />}
                        component={Link}
                        to={Urlconstant.navigate + `clientprofile/${params.row.id}`}
                        >
                        View Profile
                    </Button>
                </div>
            )
        },
    ];


    return (
        <div style={{ height: "650px", width: "100%" }}>
            <h2>ViewClient</h2>
            <h2>ViewClient</h2>
            <DataGrid
                rows={gridData.rows}
                columns={column}
        
                paginationMode="server"
            />
        </div>
    )
}
