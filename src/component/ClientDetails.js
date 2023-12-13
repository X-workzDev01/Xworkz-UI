import { Alert, Button, MenuItem, Snackbar, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react'
import { Form } from 'react-bootstrap';
import { Urlconstant } from '../constant/Urlconstant';
import { formStyle } from '../constant/FormStyle';
import { validateContactNumber, validateEmail } from '../constant/ValidationConstant';

export default function ClientDetails() {
    const statusList = ['Active', 'Inactive'].slice().sort();
    const email = sessionStorage.getItem('userId');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [companyNameCheck, setCompanyNameCheck] = React.useState("");
    const [companyEmailCheck, setCompanyEmailCheck] = React.useState("");
    const [emailCheck, setEmailCheck] = React.useState("");
    const [phoneNumberCheck, setPhoneNumberCheck] = React.useState("");
    const [formData, setFormData] = React.useState('');


    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    const handleChange = (e) => {

        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        // Validate email and phone number as the user types
        if (name === 'companyEmail') {
            if (validateEmail(value)) {
                setEmailCheck("");
            } else {
                setEmailCheck("Enter the correct Email");
            }
        }
        if (name === 'companyLandLineNumber') {
            if (validateContactNumber(value)) {
                setPhoneNumberCheck("");
            } else {
                setPhoneNumberCheck("Phone number is incorrect");
            }

        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
//        setIsSubmitting(false);
        try {
            const clientData = {
                ...formData,
                adminDto: { createdBy: email }
            };


            axios.post(Urlconstant.url + "api/registerclient", clientData)
            setOpen(true)
            setSnackbarMessage("Client information added successfully")
            setFormData({
                companyName: '',
                companyEmail: '',
                companyLandLineNumber: '',
                companyWebsite: '',
                companyLocation: '',
                companyFounder: '',
                sourceOfConnetion: '',
                companyType: '',
                companyAddress: '',
                status: '',
             
            });
        } catch (error) {
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompanyName = (event) => {
        const companyname = event.target.value;
        axios.get(Urlconstant.url + `/api/companynamecheck?companyName=${companyname}`)
            .then(res => {
                if (res.data === "Company Already Exists") {
                    setCompanyNameCheck(res.data);
                } else {
                    setCompanyNameCheck("");
                }
            })
    }
    const handleCompanyEmail = (event) => {
        const companyEmail = event.target.value;
        axios.get(Urlconstant.url + `/api/checkcompanyemail?companyEmail=${companyEmail}`)
            .then(res => {
                if (res.data === "Company Email Already Exists") {
                    setCompanyEmailCheck(res.data);
                } else {
                    setCompanyEmailCheck("");
                }
            })
    }
    const isSubmitValid = !formData.companyName || companyNameCheck || companyEmailCheck || emailCheck || phoneNumberCheck
    return (
        <div>
            <h2>Client Details</h2>
            <Form onSubmit={handleSubmit} style={formStyle}>
                <TextField
                    label="Client Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    onBlur={handleCompanyName}
                    required
                    fullWidth
                    margin="normal"
                />
                {companyNameCheck ? <Alert severity="error">{companyNameCheck}</Alert> : " "}
                <TextField
                    label="Client Email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    onBlur={handleCompanyEmail}
                />
                {companyEmailCheck ? <Alert severity="error">{companyEmailCheck}</Alert> : " "}
                {emailCheck ? <Alert severity="error">{emailCheck}</Alert> : " "}
                <TextField
                    label="Client Contact Number"
                    name="companyLandLineNumber"
                    value={formData.companyLandLineNumber}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                {phoneNumberCheck ? <Alert severity="error">{phoneNumberCheck}</Alert> : " "}
                <TextField
                    label="Client Website"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Location"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Founder"
                    name="companyFounder"
                    value={formData.companyFounder}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Source Of Connetion"
                    name="sourceOfConnetion"
                    value={formData.sourceOfConnetion}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Type"
                    name="companyType"
                    value={formData.companyType}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Company Address"
                    name="companyAddress"
                    value={formData.companyAddress}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    select
                >
                    {statusList.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitValid}
                >
                    Register
                </Button>
            </Form>

            <Snackbar
                open={open}
                onClose={handleClose}
                message={snackbarMessage}
                autoHideDuration={3000}
            />

        </div>
    )
}
