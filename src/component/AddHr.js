import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Snackbar, TextField } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import axios from 'axios';
import React, { useState } from 'react';
import { Urlconstant } from '../constant/Urlconstant';
import { fieldStyle, style } from '../constant/FormStyle';
import { validateContactNumber, validateEmail } from '../constant/ValidationConstant';


const AddHr = ({ open, handleClose, rowData }) => {


    const [isConfirming, setIsConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [isDisabled, setIdDisabled] = React.useState(true);
    const [formData, setFormData] = React.useState('');
    const attemptedEmail = sessionStorage.getItem("userId");
    const [emailCheck, setEmailCheck] = React.useState("");
    const [phoneNumber, setPhoneNumberCheck] = React.useState("");

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        if (name === 'hrEmail') {
            if (validateEmail(value)) {
                setEmailCheck("");
            } else {
                setEmailCheck("invalid email")
            }
        }
        if (name === 'hrContactNumber'){
             if(validateContactNumber(value)){
                setPhoneNumberCheck("");
             }else{
                setPhoneNumberCheck("Invalid Contact Number")
             }
        }
    }

    const handleHrAddClick = () => {
        setIsConfirming(true);
        setSnackbarOpen(false);
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        handleClose();
    };

    const handleSaveClick = (event) => {
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
                    style={style}
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
                {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : " "}
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
export default AddHr;
