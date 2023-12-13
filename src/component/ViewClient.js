import { DataGrid } from '@mui/x-data-grid';
import React from 'react'
import { Urlconstant } from '../constant/Urlconstant';
import { PersonOutline, Search } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

function loadServerRows(page, pageSize, courseName) {
    const startingIndex = page * pageSize;
    const maxRows = pageSize;
    const spreadsheetId = Urlconstant.spreadsheetId;
    const apiUrl =
        Urlconstant.url +
        `api/readData?startingIndex=${startingIndex}&maxRows=${maxRows}}`;
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            spreadsheetId: spreadsheetId,
        },
    };
    return new Promise((resolve) => {
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                resolve({
                    rows: data.sheetsData.map((row) => ({
                        ...row,
                    })),
                    rowCount: data.size,
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                resolve({ rows: [], rowCount: 0 });
            });
    });
}



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
                //   console.log("Fetched data from server:", newGridData);
                setGridData(newGridData);
            }
        );
    }, [paginationModel.page, paginationModel.pageSize]);

    function searchServerRows(page, pageSize) {
        const startingIndex = page * pageSize;
        var apiUrl =
            Urlconstant.url +
            `api/readclientinfomation?startingIndex=${startingIndex}&maxRows=${25}`;
        return new Promise((resolve) => {
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    const newGridData = {
                        rows: data.clientData.map((row) => ({
                            id: row.id.toString(),
                            ...row,
                        })),
                        rowCount: data.size,
                    };

                    resolve(newGridData);
                })
                .catch((error) => {
                    resolve({ rows: [], rowCount: 0 });
                });
        });
    }


    const column = [
        //  { headerName: 'ID', field: 'id' },
        {
            field: "companyName",
            headerName: "Company Name",
            flex: 1,
            valueGetter: (params) => params.row.companyName,
        },
        {
            field: "companyEmail",
            headerName: " E-mail",
            flex: 1,
            valueGetter: (params) => params.row.companyEmail,
        },
        {
            field: "companyWebsite",
            headerName: " Website",
            flex: 1,
            valueGetter: (params) => params.row.companyWebsite,
        },
        {
            field: "companyType",
            headerName: "Company Type",
            flex: 1,
            valueGetter: (params) => params.row.companyType,
        },
        {
            field: "companyAddress",
            headerName: " Address",
            flex: 1,
            valueGetter: (params) => params.row.companyAddress,
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
                        View
                    </Button>
                </div>
            )
        },
    ];


    return (
        <div style={{ height: "650px", width: "100%" }}>
            <div
                className="search"
                style={{ display: "flex", alignItems: "center", marginTop: "100px" }}
            >
                <TextField
                    Search
                    name="searchValue"
                />
            </div>
            <h1></h1>
            <div style={{ height: "650px", width: "100%" }}>
                <DataGrid
                    rows={gridData.rows}
                    columns={column}
                    pageSizeOptions={[5, 10, 25]}
                    paginationMode="server"
                    rowCount={gridData.rowCount}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    keepNonExistentRowsSelected

                />
            </div>
        </div>
    )
}
