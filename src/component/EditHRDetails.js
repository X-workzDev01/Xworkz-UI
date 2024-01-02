import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Snackbar, TextField } from "@mui/material"
import { GridCloseIcon } from "@mui/x-data-grid";
import { fieldStyle, style } from "../constant/FormStyle";
import React from "react";
import axios from "axios";
import { Urlconstant } from "../constant/Urlconstant";

const EditHRDetails = ({ open, handleClose, rowData }) => {
    const [editedData, setEditedData] = React.useState([]);
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const attemptedEmail = sessionStorage.getItem("userId");

    React.useEffect(() => {
        setEditedData(rowData);
    }, [rowData]);


    const handleEditClick = () => {
        setIsConfirming(true);
        setSnackbarOpen(false);

    }

    const handleCloseForm = () => {
        setResponseMessage("");
        setSnackbarOpen(false);
        handleClose();
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        handleClose();
    };


    const handleInput = (event) => {
        const { name, value } = event.target;
        setEditedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
    const handleSaveClick = (event) => {
        event.preventDefault();
        const updatedData = {
            ...editedData,
            adminDto: {
                ...editedData.adminDto,
                updatedBy: attemptedEmail,
            },
        };
        axios.put(Urlconstant.url + `api/updatebyId?hrId=${rowData.id}`, updatedData).then((response) => {
            setResponseMessage(response.data)
            if (response.status === 200) {
                setLoading(false);
                setSnackbarOpen(true);
                setResponseMessage(response.data)
                setTimeout(() => {
                    handleCloseForm();
                }, 1000);
            }
        })
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Edit HR Details
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
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hr name"
                            name="hrScopName"
                            style={fieldStyle}
                            defaultValue={rowData.hrScopName}
                            onChange={handleInput}

                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hr Email Id"
                            name="hrEmail"
                            style={fieldStyle}
                            defaultValue={rowData.hrEmail}
                            onChange={handleInput}
                        />

                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hr ContactNumber"
                            name="hrContactNumber"
                            style={fieldStyle}
                            defaultValue={rowData.hrContactNumber}
                            onChange={handleInput}
                        />

                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hr Designation"
                            name="designation"
                            style={fieldStyle}
                            defaultValue={rowData.designation}
                            onChange={handleInput}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hr Status"
                            name="status"
                            style={fieldStyle}
                            defaultValue={rowData.status}
                            onChange={handleInput}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    // disabled={isDisabled}
                    onClick={handleEditClick}
                    color="primary"
                >
                    Edit
                </Button>
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={responseMessage}
            /> 

             <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogContent>Are you sure Want to Update the HR Details</DialogContent>
                <DialogActions>
                    <IconButton
                        color="inherit"
                        onClick={() => setIsConfirming(false)}
                        edge="start"
                        aria-label="close"
                        style={style}
                    >
                        <GridCloseIcon />
                    </IconButton>
                    <Button onClick={handleSaveClick} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};
export default EditHRDetails;