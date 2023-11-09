import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { Urlconstant } from '../constant/Urlconstant';
import { MenuItem } from '@mui/material';

const formStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    marginTop: '70px',
};

function Enquiry() {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        qualification: '',
        stream: '',
        yearOfPassout: '',
    });

    const [errors, setErrors] = useState({});
    const [nameValid, setNameValid] = useState(true);
    const [phoneNumberValid, setPhoneNumberValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [phoneNumberExists, setPhoneNumberExists] = useState(false);
    const [emailExists, setEmailExists] = useState(false);
    const [qualificationOptions, setQualification] = useState([]);
    const email = sessionStorage.getItem("userId");

    const [streamOptions, setStreamOptions] = useState([]); // For storing stream options
    const [yearOfPassoutOptions, setYearOfPassoutOptions] = useState([]); // For storing year of passout options

    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // You can set the severity as needed

    const openSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setIsSnackbarOpen(true);
    };

    useEffect(() => {
        // Fetch data for stream and yearOfPassout dropdowns
        const fetchData = async () => {
            try {
                const response = await axios.get(Urlconstant.url + 'utils/dropdown', {
                    headers: setCommonHeaders(),
                });

                if (response.status === 200) {
                    const data = response.data;

                    // Populate the dropdown options
                    setQualification(data.qualification);
                    setStreamOptions(data.stream);
                    setYearOfPassoutOptions(data.yearofpass);

                } else {
                    console.error('Failed to fetch dropdown data');
                }
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
            }
        };

        fetchData(); // Call the fetchData function when the component mounts
    }, []);

    useEffect(() => {
        let phoneNumberTimeout;

        // Check if the phone number exists when phoneNumber changes
        if (formData.phoneNumber) {
            // Clear the previous timeout if any
            clearTimeout(phoneNumberTimeout);
            // Set a new timeout to make the API call after 2 seconds
            phoneNumberTimeout = setTimeout(() => {
                checkPhoneNumberExists(formData.phoneNumber);
            }, 800);
        }

        // Cleanup function to clear the timeout if the component unmounts or if phoneNumber changes
        return () => {
            clearTimeout(phoneNumberTimeout);
        };
    }, [formData.phoneNumber]);

    useEffect(() => {
        let emailTimeout;

        // Check if the email exists when email changes
        if (formData.email) {
            // Clear the previous timeout if any
            clearTimeout(emailTimeout);
            // Set a new timeout to make the API call after 2 seconds
            emailTimeout = setTimeout(() => {
                checkEmailExists(formData.email);
            }, 800);
        }

        // Cleanup function to clear the timeout if the component unmounts or if email changes
        return () => {
            clearTimeout(emailTimeout);
        };
    }, [formData.email]);

    const setCommonHeaders = () => {
        return {
            'spreadsheetId': Urlconstant.spreadsheetId,
        };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Validate email and phone number as the user types
        if (name === 'email') {
            if (value && !validateEmail(value)) {
                setErrors({ ...errors, email: 'Email Address Invalid' });
                setEmailValid(false);
            } else {
                setErrors({ ...errors, email: '' });
                setEmailValid(true);
            }
        } else if (name === 'phoneNumber') {
            if (value && !validatePhoneNumber(value)) {
                setErrors({ ...errors, phoneNumber: 'Phone Number Invalid' });
                setPhoneNumberValid(false);
            } else {
                setErrors({ ...errors, phoneNumber: '' });
                setPhoneNumberValid(true);
            }
        }
        else if (name === 'name') {
            if (value && value.length <= 2) {
                setErrors({ ...errors, name: 'Name Invalid' });
                setNameValid(false);
            } else {
                setErrors({ ...errors, name: '' });
                setNameValid(true);
            }
        }
    };

    const validateEmail = (email) => {
        // Regular expression to validate email
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        return emailRegex.test(email);
    };

    const validatePhoneNumber = (phoneNumber) => {
        // Regular expression to validate a 10-digit mobile number
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const checkPhoneNumberExists = async (phoneNumber) => {
        try {
            const response = await axios.get(Urlconstant.url + `api/contactNumberCheck?contactNumber=${phoneNumber}`, {
                headers: setCommonHeaders(),
            });

            if (response.status === 201) {
                // Phone number exists in the database
                setPhoneNumberExists(true);
            } else {
                // Phone number does not exist
                setPhoneNumberExists(false);
            }
        } catch (error) {
            console.error('Error checking phone number:', error);
        }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(Urlconstant.url + `api/emailCheck?email=${email}`, {
                headers: setCommonHeaders(),
            });

            if (response.status === 201) {
                // Email exists in the database
                setEmailExists(true);
            } else {
                // Email does not exist
                setEmailExists(false);
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
    };

    const isSubmitDisabled = !formData.name || !phoneNumberValid || !emailValid || phoneNumberExists || emailExists || !nameValid || submitDisabled;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = {};

        // Validation code...

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {

           setSubmitDisabled(true);
            try {
                // Create the data structure to be sent in the API
                const requestData = {
                    basicInfo: {
                        traineeName: formData.name,
                        contactNumber: formData.phoneNumber,
                        email: formData.email,
                    },
                    educationInfo: {
                        qualification: formData.qualification,
                        stream: formData.stream,
                        yearOfPassout: formData.yearOfPassout,
                    },
                    adminDto: { createdBy: email }
                };

                const response = await axios.post(Urlconstant.url + "api/enquiry", requestData, {
                    headers: setCommonHeaders(),
                });

                if (response.status === 200) {
                    openSnackbar('Enquiry added successfully', 'success');
                    setFormData({
                        name: '',
                        phoneNumber: '',
                        email: '',
                        qualification: '',
                        stream: '',
                        yearOfPassout: '',
                    });
                } else {
                    console.error('Failed to submit data');
                    // Handle the error or show an error message to the user
                }
            } catch (error) {
                console.error('Error:', error);
            }
            finally {
                setSubmitDisabled(false);
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={formStyle}>
                <TextField
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    error={errors.name ? true : false}
                    helperText={errors.name}
                />
                <TextField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                    margin="normal"
                    error={errors.phoneNumber || phoneNumberExists ? true : false}
                    helperText={errors.phoneNumber || phoneNumberExists ? (phoneNumberExists ? 'Phone Number already exists' : 'Invalid Phone Number') : ''}
                />
                <TextField
                    label="Email (optional)"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    error={errors.email || emailExists ? true : false}
                    helperText={errors.email || emailExists ? (emailExists ? 'Email already exists' : 'Invalid Email Address') : ''}
                />
                <TextField
                    label="Qualification (optional)"
                    name="qualification"
                    select
                    value={formData.qualification}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    {qualificationOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Stream (optional)"
                    name="stream"
                    select
                    value={formData.stream}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    {streamOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Year of Passout (optional)"
                    name="yearOfPassout"
                    select
                    value={formData.yearOfPassout}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                >
                    {yearOfPassoutOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitDisabled}
                >
                    Submit
                </Button>
            </form>

            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000} // Adjust the duration as needed
                onClose={() => setIsSnackbarOpen(false)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={() => setIsSnackbarOpen(false)}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}

export default Enquiry;
