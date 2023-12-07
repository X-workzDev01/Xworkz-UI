import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, TextField } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useState } from 'react';
import { Urlconstant } from '../constant/Urlconstant';

const fieldStyle = { margin: "20px" };
const AddHr = ({ open, handleClose, rowData }) => {


    const [isConfirming, setIsConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [isDisabled, setIdDisabled] = React.useState(true);
    const [formData, setFormData] = React.useState('');
    const attemptedEmail = sessionStorage.getItem("userId");

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const handleHrAddClick = () => {
        console.log("add click")
        setIsConfirming(true);
        setSnackbarOpen(false);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        handleClose();
    };

    const handleSaveClick = (event) => {
        console.log("can save data")
        console.log(rowData)
        event.preventDefault();
        //setIsSubmitting(false);
        try {
            const hrData = {
                ...formData,
                companyId: rowData.id,
                adminDto: { createdBy: attemptedEmail }
            };
            
            axios.post(Urlconstant.url + "api/registerclienthr", hrData)
            //setOpen(true)
            //setSnackbarMessage("Client information added successfully")
            setFormData({
                //companyId="",
                hrScopName: '',
                hrEmail: '',
                hrContactNumber: '',
                designation: '',
                status: '',
            });
        } catch (error) {
        } finally {
            //setIsSubmitting(false);
        }

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
                    style={{ position: "absolute", right: "8px", top: "8px" }}
                >
                    <GridCloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Hr name"
                    name="hrScopName"
                    onChange={handleInputChange}
                    style={fieldStyle}
                    value={formData.hrScopName}
                />
                <TextField
                    label="Hr Email Id"
                    name="hrEmail"
                    onChange={handleInputChange}
                    style={fieldStyle}
                    value={formData.hrEmail}
                />
                <TextField
                    label="Hr ContactNumber"
                    name="hrContactNumber"
                    onChange={handleInputChange}
                    style={fieldStyle}
                    value={formData.hrContactNumber}
                />
                <TextField
                    label="Hr Designation"
                    name="designation"
                    onChange={handleInputChange}
                    style={fieldStyle}
                    value={formData.designation}
                />
                <TextField
                    label="Hr Status"
                    name="status"
                    onChange={handleInputChange}
                    style={fieldStyle}
                    value={formData.status}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    //      disabled={isDisabled}
                    onClick={handleHrAddClick}
                    color="primary"
                >
                    Add
                </Button>
            </DialogActions>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000000}
                onClose={handleSnackbarClose}
            // message={responseMessage}
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
                        style={{ position: "absolute", right: "8px", top: "8px" }}
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
export default AddHr;
