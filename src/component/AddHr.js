import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import axios from 'axios';
import React from 'react';
import { Urlconstant } from '../constant/Urlconstant';
import { fieldStyle, style } from '../constant/FormStyle';
import { validateContactNumber, validateEmail } from '../constant/ValidationConstant';


const AddHr = ({ open, handleClose, rowData }) => {

    const hrDisgnation = ['HR', 'HR Manager', 'HR Assistant', 'Recruiter', 'HR Analyst', 'Talent Acquisition', 'Other']
    const [loading, setLoading] = React.useState(false);
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [formData, setFormData] = React.useState('');
    const attemptedEmail = sessionStorage.getItem("userId");
    const [emailCheck, setEmailCheck] = React.useState("");
    const [phoneNumber, setPhoneNumberCheck] = React.useState("");
    const [checkEmailExist, setCheckEmailExist] = React.useState("");
    const [checkPhoneNumberExist, setCheckPhoneNumberExist] = React.useState("");
    const [verifyEmail, setVerifyEmail] = React.useState("");
    const [validateName, setValidateName] = React.useState("");
    const [validateDesignation, setValidateDesignation] = React.useState("");

    const [charCount, setCharCount] = React.useState("");
    const handleInputChange = (event) => {
        const { name, value } = event.target;

        if (name === 'hrScopName') {
            if (value && value.length <= 2) {
                setValidateName("Enter the valid name");
            } else {
                setValidateName("");
            }
        }
        if (name === 'hrEmail') {
            if (validateEmail(value)) {
                setEmailCheck("");
            } else {
                setEmailCheck("invalid email");
                setCheckEmailExist("");
            }
        }
        if (name === 'hrContactNumber') {
            if (validateContactNumber(value)) {
                setPhoneNumberCheck("");
            } else {
                setPhoneNumberCheck("Invalid Contact Number");
                setCheckPhoneNumberExist("");
            }
        }
        if (name === 'designation') {
            if (value && value.length <= 1) {
                setValidateDesignation("Enter the correct designation");
            } else {
                setValidateDesignation("");
            }
        }
        if (name === 'status') {
            setCharCount(value.length);
        } else {
            setCharCount("")
        }

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
        if (isConfirming) {
            setLoading(true);
            try {
                const hrData = {
                    ...formData,
                    companyId: rowData.id,
                    adminDto: { createdBy: attemptedEmail }
                };
    
                for (const field in hrData) {
                    if (!hrData[field]) {
                        hrData[field] = "NA";
                    }
                }
    
                axios.post(Urlconstant.url + "api/registerclienthr", hrData)
                    .then((response) => {
                        if (response.status === 200) {
                            setSnackbarOpen(true)
                            setLoading(false)
                            setResponseMessage(response.data)
                            setIsConfirming(false);
                            setTimeout(() => {
                                handleCloseForm();
                            }, 1000);
                            setFormData({
                                hrScopName: '',
                                hrEmail: '',
                                hrContactNumber: '',
                                designation: '',
                                status: '',
                            });
                        }
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 500) {
                            // Handle HTTP status code 500
                            setLoading(false)
                            setResponseMessage("Internal Server Error: Please try again later");
                            setSnackbarOpen(true);
                        } else {
                            // Handle other errors
                            setLoading(false)
                            setResponseMessage("HR information not saved")
                            setSnackbarOpen(true);
                        }
                    });
            } catch (error) {
                setLoading(false)
                setResponseMessage("HR information not saved")
                setSnackbarOpen(true);
            }
        }
    }
    
    const validatingEmail = (email) => {
        axios
            .get(`${Urlconstant.url}api/verify-email?email=${email}`)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data === "accepted_email") {
                        setVerifyEmail(response.data);
                    } else if (response.data === "rejected_email") {
                        setVerifyEmail(response.data);

                    } else {
                        setVerifyEmail("");
                    }
                } else {
                    if (response.status === 500) {
                        setVerifyEmail("");
                    } else {
                        setVerifyEmail("Unexpected Error:");
                    }
                }
            })
            .catch((error) => {
                console.log("check emailable credentils");
            });
    };

    const handleEmailCheck = (event) => {
        let email = event.target.value;
        axios.get(Urlconstant.url + `api/hremailcheck?hrEmail=${email}`)
            .then((response) => {
                if (response.data === 'Email already exists.') {
                    setEmailCheck("");
                    setCheckEmailExist(response.data);
                } else {
                    validatingEmail(email);
                    setCheckEmailExist("");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 500) {
                    setCheckEmailExist("");
                } else {
                    setCheckEmailExist("Error in API call");
                }
            });
    };
    
    const handleNumberCheck = (event) => {
        let contactNumber = event.target.value;
        axios.get(Urlconstant.url + `api/hrcontactnumbercheck?contactNumber=${contactNumber}`)
            .then((response) => {
                if (response.data === "Contact Number Already exist.") {
                    setCheckPhoneNumberExist(response.data);
                } else {
                    setCheckPhoneNumberExist("");
                    setPhoneNumberCheck("");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 500) {
                    setCheckPhoneNumberExist("");
                } else {
                    setCheckPhoneNumberExist("Error in API call");
                }
            });
    };
    

    const isDisabled = checkPhoneNumberExist || checkEmailExist || emailCheck || !formData.hrScopName || !formData.hrContactNumber || !formData.designation
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
                            label="Hr Scop Name"
                            name="hrScopName"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.hrScopName}
                        />
                        {validateName ? <Alert severity="error">{validateName}</Alert> : " "}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hr Email Id"
                            name="hrEmail"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.hrEmail}
                            onBlur={handleEmailCheck}
                        />
                        {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : " "}
                        {checkEmailExist ? <Alert severity="error">{checkEmailExist}</Alert> : " "}
                        {verifyEmail ? <Alert severity="error">{verifyEmail}</Alert> : " "}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hr ContactNumber"
                            name="hrContactNumber"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.hrContactNumber}
                            onBlur={handleNumberCheck}
                        />
                        {phoneNumber ? <Alert severity="error">{phoneNumber}</Alert> : " "}
                        {checkPhoneNumberExist ? <Alert severity="error">{checkPhoneNumberExist}</Alert> : " "}

                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Hr Designation"
                            name="designation"
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.designation}
                            select
                            fullWidth
                            margin="normal"
                        >
                        {hrDisgnation.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Comments"
                            name="status"
                           helperText={`${charCount}`}
                            onChange={handleInputChange}
                            style={fieldStyle}
                            value={formData.status}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
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
                onClose={handleSnackbarClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {responseMessage}
                </Alert>
            </Snackbar>
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
