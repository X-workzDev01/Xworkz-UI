import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Snackbar, TextField } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useState } from 'react';
import { Urlconstant } from '../constant/Urlconstant';
import { fieldStyle, style } from '../constant/FormStyle';

const HrFollowUp = ({ open, handleClose, rowData }) => {


    const [isConfirming, setIsConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    //const [isDisabled, setDisabled] = React.useState(true);
    const [formData, setFormData] = React.useState('');
    const attemtedUser = sessionStorage.getItem("userId");


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

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

    const handleSaveClick = (event) => {
        event.preventDefault();
        console.log(formData)

    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Add New HR
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
                            label="attemptBy"
                            name="attemptBy"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.attemptBy}
                            defaultValue={attemtedUser}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Attempt Status"
                            name="attemptStatus"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.attemptStatus}

                        />


                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Call Duration"
                            name="callDuration"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.callDuration}
                        />

                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            type="date"
                            label="Call Back Date"
                            name="callBackDate"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.callBackDate}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="call Back Time"
                            name="callBackTime"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.callBackTime}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="comments"
                            name="comments"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.comments}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleHrAddClick}
                    color="primary"
                >
                    Add
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
                <DialogContent>Adding New HR Details</DialogContent>
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
export default HrFollowUp;
