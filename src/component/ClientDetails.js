import { Alert, Button, MenuItem, Snackbar, TextField } from '@mui/material';
import axios from 'axios';
import React from 'react'
import { Form } from 'react-bootstrap';
import { Urlconstant } from '../constant/Urlconstant';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

export default function ClientDetails() {

    const formStyle = {
        maxWidth: '400px',
        margin: '0 auto',
        padding: '10px',
        marginTop: '70px',
    };
    const statusList = ['Active', 'Inactive'].slice().sort();
    const email = sessionStorage.getItem('userId');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");
    const [companyNameCheck, setCompanyNameCheck] = React.useState("");


    const handleClose = (reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const [formData, setFormData] = React.useState({
        companyName: '',
        companyEmail: '',
        companyLandLineNumber: '',
        companyWebsite: '',
        companyLocation: '',
        status: '',
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(false);
        try {
            const clientData = {
                ...formData,
                adminDto: { createdBy: email }
            };

            axios.post(Urlconstant.url + "api/saveclientinfo", clientData)  
            setOpen(true)
            setSnackbarMessage("Client information added successfully")
            setFormData({
                companyName: '',
                companyEmail: '',
                companyLandLineNumber: '',
                companyWebsite: '',
                companyLocation: '',
                status: '',
            });
        } catch (error) {
            console.log("error saving data")
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCompanyName = (event) => {
        const companyname = event.target.value;
        axios.get(Urlconstant.url + `/api/companynamecheck?companyName=${companyname}`)
            .then(res => {
                if(res.data==="Company Already Exists"){
                setCompanyNameCheck(res.data);
                }else{
                    setCompanyNameCheck("");
                }
            })
    }
    const isSubmitValid = !formData.companyName || !formData.companyEmail || !formData.companyLandLineNumber || companyNameCheck
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
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Contact Number"
                    name="companyLandLineNumber"
                    value={formData.companyLandLineNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Website"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Location"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    required
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
