import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, MenuItem, Snackbar, TextField } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Urlconstant } from '../constant/Urlconstant';
import { fieldStyle, style } from '../constant/FormStyle';

const CompanyFollowUp = ({ open, handleClose, rowData }) => {
    const callingStatus = ['RNR', 'Busy', 'Not Reachable', 'Call Drop', 'Call you later'].slice().sort();
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState('');
    const attemtedUser = sessionStorage.getItem("userId");
    const [hrNameList, setHrNameList] = React.useState([]);

    const getdetailsbyCompanyId = () => {
        console.log("getting details by company Id")
        const i = rowData.id;
        console.log(rowData)
        axios.get(Urlconstant.url + `api/gethrdetails?companyId=2`).then((response) => {
            console.log(response.data);

            setHrNameList(response.data)
        }).catch((e) => {
            console.log(e);
        })
    }


    useEffect(() => {
        getdetailsbyCompanyId();
    }, [])
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

    const handleSaveClick = () => {
        if (setIsConfirming) {
            setLoading(true)
            try {
                const hrFollowUpData = {
                    ...formData,
                    hrId: rowData.id,
                    attemptBy: attemtedUser
                };

                axios.post(Urlconstant.url + `api/hrfollowup`, hrFollowUpData).then((response) => {
                    if (response.status === 200) {
                        setSnackbarOpen(true)
                        setLoading(false)
                        setResponseMessage(response.data)
                        setIsConfirming(false);
                        setTimeout(() => {
                            handleCloseForm();
                        }, 1000);
                    }
                })
            } catch (response) {
                setResponseMessage("Not added to follow up");
                setLoading(false);
                setSnackbarOpen(true);
            }
        }
    }
    const isDisabled = !formData.attemptStatus;
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Follow Up
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
                            label="HR Name"
                            name="attemptStatus"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.attemptStatus}
                            fullWidth
                            select
                            margin="normal"
                        >
                            {hrNameList.map((hrItem) => (
                                <MenuItem key={hrItem.id} value={hrItem.id}>
                                    {hrItem.hrScopName} {/* Assuming that 'name' is the property containing HR names */}
                                </MenuItem>
                            ))}
                        </TextField>


                    </Grid>
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
                            fullWidth
                            select
                            margin="normal"
                        >
                            {callingStatus.map((item) => (
                                <MenuItem key={item} value={item}>
                                    {item}
                                </MenuItem>
                            ))}
                        </TextField>
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
                            id="callBackDate"
                            InputLabelProps={{
                                shrink: true,
                            }}
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
                            labelId="demo-simple-select-label"
                            label="comments"
                            name="comments"
                            onChange={handleInputChange}
                            value={formData.comments}
                            multiline
                            rows={4}
                            style={fieldStyle}
                            id="comments"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                {loading ? (
                    <CircularProgress size={20} />
                ) : (
                    <Button
                        disabled={isDisabled}
                        onClick={handleHrAddClick}
                        color="primary"
                    >
                        Add
                    </Button>
                )}
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {responseMessage}
                </Alert>
            </Snackbar>

            <Dialog open={isConfirming} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Confirm Save</DialogTitle>
                <DialogContent>Adding Follow Up</DialogContent>
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
export default CompanyFollowUp;