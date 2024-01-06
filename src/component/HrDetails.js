import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import React from 'react';
import { Urlconstant } from '../constant/Urlconstant';
import {  gridStyle, style } from '../constant/FormStyle';
import { DataGrid } from '@mui/x-data-grid';
import { PersonOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';


const HRDetails = ({ open, handleClose, id }) => {

    const initialPageSize = 25;
    const [paginationModel, setPaginationModel] = React.useState({
        page: 0,
        pageSize: initialPageSize,
    });
    const [gridData, setGridData] = React.useState({
        rows: [],
        rowCount: 0,
    });
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    //const [isDisabled, setDisabled] = React.useState(true);
    const [formData, setFormData] = React.useState('');
    const attemptedEmail = sessionStorage.getItem("userId");
    //const [rowdata, setRowData] = React.useState({ ...rowData });

    const handleHrAddClick = () => {
        setIsConfirming(true);
        setSnackbarOpen(false);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        handleClose();
    };
    const handleCloseForm = () => {
        setResponseMessage("");
        setSnackbarOpen(false);
        handleClose();
    };

    
    React.useEffect(() => {
        searchServerRows(paginationModel.page, paginationModel.pageSize,id).then(
            (newGridData) => {
                setGridData(newGridData);
            }
        );
    }, [paginationModel.page, paginationModel.pageSize]);

    function searchServerRows(page, pageSize,id) {
   //  let companyId=rowData.id;
     console.log(id)
        const startingIndex = page * pageSize;
        var apiUrl =
            Urlconstant.url +
            `api/hrdetails?startingIndex=${startingIndex}&maxRows=${25}&companyId=${id}`;
        return new Promise((resolve) => {
            fetch(apiUrl)
                .then((response) => response.json())
                .then((data) => {
                    const newGridData = {
                        rows: data.clientHrDetails.map((row) => ({
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


       const columns=[
        {
            field: "hrScopName",
            headerName: "HR Scope Name",
            flex: 1,
            valueGetter: (params) => params.row.hrScopName,
        },
        {
            field: "hrEmail",
            headerName: "HR E-mail",
            flex: 1,
            valueGetter: (params) => params.row.hrEmail,
        },
        {
            field: "hrContactNumber",
            headerName: " HR ContactNumber",
            flex: 1,
            valueGetter: (params) => params.row.hrContactNumber,
        },
        {
            field: "designation",
            headerName: "Designation",
            flex: 1,
            valueGetter: (params) => params.row.designation,
        },
        {
            field: "status",
            headerName: " Status",
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
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                HR Details
                <IconButton
                    color="inherit"
                    onClick={handleClose}
                    edge="start"
                    aria-label="close"
                    style={style}
                >
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
            <div style={gridStyle}>
                <DataGrid
                    rows={gridData.rows}
                    columns={columns}
                    pageSizeOptions={[5, 10, 25]}
                    paginationMode="server"
                    rowCount={gridData.rowCount}
                    pagination
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    keepNonExistentRowsSelected

                />
            </div>              

            </DialogContent>
        </Dialog>
    );
};
export default HRDetails;
