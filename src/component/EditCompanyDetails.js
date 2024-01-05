import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Snackbar, TextField } from '@mui/material';
import { GridCloseIcon } from '@mui/x-data-grid';
import axios from 'axios';
import React from 'react';
import { Urlconstant } from '../constant/Urlconstant';
import { style } from '../constant/FormStyle';
import { validateContactNumber, validateEmail } from '../constant/ValidationConstant';



const EditCompanyDetails = ({ open, handleClose, rowData }) => {
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [responseMessage, setResponseMessage] = React.useState("");
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const attemptedEmail = sessionStorage.getItem("userId");
    const [emailCheck, setEmailCheck] = React.useState("");
    const [phoneNumberCheck, setPhoneNumberCheck] = React.useState("");
    const [checkEmailExist, setCheckEmailExist] = React.useState("");
    const [editedData, setEditedData] = React.useState([]);
    const [companyNameCheck, setCompanyNameCheck] = React.useState("");
    const [isDisabled, setIsDisabled] = React.useState(true);
    const [nameCheck, setNameCheck] = React.useState("");
    const [verifyEmail, setVerifyEmail] = React.useState("");


    React.useEffect(() => {
        setEditedData(rowData);
        setIsDisabled(true)
        setNameCheck("")
        setCompanyNameCheck("")
        setCheckEmailExist("")
        setEmailCheck("")
        setPhoneNumberCheck("")
    }, [rowData]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'companyName') {
            if (value === " " || value.length === 0 && value.length <= 2) {
                setNameCheck("Enter the Correct Company Name");
                setCompanyNameCheck("");
            } else {
                setNameCheck("")
            }
        }
        if (name === 'companyEmail') {
            if (validateEmail(value)) {
                setEmailCheck("");
            } else {
                setIsDisabled(true)
                setEmailCheck("Enter the correct Email");
            }
        }
        if (name === 'companyLandLineNumber') {
            if (validateContactNumber(value)) {
                setPhoneNumberCheck("");
                setIsDisabled(false)
            } else {
                setIsDisabled(true)
                setPhoneNumberCheck("Phone number is incorrect");
            }

        }
        setEditedData((prevData) => ({
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


    const handleCompanyNameCheck = (companyName) => {
       if(companyName==="NA"){
        setCompanyNameCheck("");
       }else{
        axios.get(Urlconstant.url + `/api/companynamecheck?companyName=${companyName}`)
            .then(res => {
                if (res.data === "Company Already Exists") {
                    setIsDisabled(false)
                    setCompanyNameCheck(res.data);
                } else {
                    setIsDisabled(false)
                    setCompanyNameCheck("");
                }
            })
        }
    }
    const handleCompanyEmail = (companyEmail) => {
        if (companyEmail === 'NA') {
            setCheckEmailExist("");
        } else {
            axios.get(Urlconstant.url + `/api/checkcompanyemail?companyEmail=${companyEmail}`)
                .then(res => {
                    if (res.data === "Company Email Already Exists") {
                        setCheckEmailExist(res.data);
                    } else {
                        setCheckEmailExist("");
                        validatingEmail(companyEmail);
                        setIsDisabled(false)
                    }
                })
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
                        setIsDisabled(true)
                        setVerifyEmail(response.data);
                    } else {
                        setVerifyEmail("");
                    }
                } else {
                    if (response.status === 500) {
                        console.log("Internal Server Error:", response.status);
                    } else {
                        console.log("Unexpected Error:", response.status);
                    }
                }
            })
            .catch((error) => {
                console.log("check emailable credentils");
            });
    };

    const handleEmail = (event) => {
        const email = event.target.value;
        if (email === rowData.companyEmail) {
            setIsDisabled(false);
        } else {
            handleCompanyEmail(email);
        }
    }


    const handleCompanyName = (event) => {
        const companyName = event.target.value;
        if (companyName === rowData.companyName) {
            setIsDisabled(false);
        } else {
            if (!nameCheck) {
                handleCompanyNameCheck(companyName)
            }
        }
    }

    const handleSaveClick = () => {
        if (setIsConfirming) {
            setLoading(true)
            try {
                const updatedData = {
                    ...editedData,
                    adminDto: {
                        ...editedData.adminDto,
                        updatedBy: attemptedEmail,
                    },
                };
                axios.put(Urlconstant.url + `api/clientupdate?companyId=${rowData.id}`, updatedData).then((response) => {
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
                setResponseMessage("Company profile not updated");
                setLoading(false);
                setSnackbarOpen(true);
            }
        }
    }
    
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>
                Edit Company Details
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
                            label="Company Name"
                            name="companyName"
                            defaultValue={rowData.companyName}
                            onChange={handleChange}
                            onBlur={handleCompanyName}
                            required
                            fullWidth
                            margin="normal"
                        />

                        {nameCheck ? <Alert severity="error">{nameCheck}</Alert> : " "}
                        {companyNameCheck ? <Alert severity="error">{companyNameCheck}</Alert> : " "}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Company Email"
                            name="companyEmail"
                            defaultValue={rowData.companyEmail}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            onBlur={handleEmail}
                        />
                        {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : " "}
                        {checkEmailExist ? <Alert severity="error">{checkEmailExist}</Alert> : " "}

                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Company Contact Number"
                            name="companyLandLineNumber"
                            defaultValue={rowData.companyLandLineNumber}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"

                        />
                        {phoneNumberCheck ? <Alert severity="error">{phoneNumberCheck}</Alert> : " "}


                    </Grid>
                    <Grid item xs={12} sm={4}>

                        <TextField
                            label="Company Website"
                            name="companyWebsite"
                            defaultValue={rowData.companyWebsite}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"

                        />

                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Company Location"
                            name="companyLocation"
                            defaultValue={rowData.companyLocation}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Company Founder"
                            name="companyFounder"
                            defaultValue={rowData.companyFounder}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Company Source Of Connetion"
                            name="sourceOfConnetion"
                            defaultValue={rowData.sourceOfConnetion}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Company Type"
                            name="companyType"
                            defaultValue={rowData.companyType}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        >
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Company Status"
                            name="status"
                            defaultValue={rowData.status}
                            onChange={handleChange}
                            required
                            fullWidth
                            margin="normal"
                        >
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            id="standard-multiline-static"
                            rows={4}
                            label="Company Address"
                            name="companyAddress"
                            defaultValue={rowData.companyAddress}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            multiline
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
                        Edit
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
                <DialogTitle>Confirm Edit</DialogTitle>
                <DialogContent>Are you sure want to Edit the Company Details?</DialogContent>
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
export default EditCompanyDetails;

