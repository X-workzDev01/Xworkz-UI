import { TextField, Button, Alert, Typography, Container } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Urlconstant } from '../constant/Urlconstant';

export const Trainee = ({ formData, setFormData, onNext }) => {
  const [error, setError] = useState();
  const [emailCheck, setEmailCheck] = useState();
  const [numberCheck, setNumberCheck] = useState();
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmail = (e) => {
    validateEmail(formData.email);
    axios.get(Urlconstant.url + `api/emailCheck?email=${formData.email}`, {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      setEmailCheck(response.data);
    }).catch();
    //setError("Check Email Id")
    console.log(error)
  }

  const handleNumberChange = (e) => {
    console.log("number check")
    validatePhoneNumber(formData.contactNumber)
    axios.get(Urlconstant.url + `api/contactNumberCheck?contactNumber=${formData.contactNumber}`, {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      setNumberCheck(response.data);
    }).catch(error => {
      console.log(error)
    });
  }

  const validateEmail = (value) => {
    if (!value) {
      setEmailError('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
  };

  const validatePhoneNumber = (value) => {
    if (!value) {
      setPhoneNumberError('Phone number is required');
    } else if (!/^\d+$/.test(value)) {
      setPhoneNumberError('Phone number must contain only digits');
    } else if (value.length <= 10) {
      setPhoneNumberError('Phone number must be at least 10 digits');
    } else {
      setPhoneNumberError('');
    }
  };

  const isDisabled = !formData.traineeName || !formData.email || !formData.contactNumber || !emailCheck || !numberCheck;
  return (
    <Container maxWidth="sm">
      <Typography component="div" style={{ height: '50vh' }}>
        <h2>Trainee</h2>
        <Form>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField type="text"
            label="User Name"
            name="traineeName"
            fullWidth
            margin="normal"
            required
            id="outlined-basic"
            variant="outlined"
            value={formData.traineeName || ''}
            onChange={handleInputChange}
          />

          <TextField type="email"
            label="E-mail"
            required
            name="email"
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
            value={formData.email || ''}
            onChange={handleInputChange}
            onBlur={handleEmail}
            helperText={emailError}
          />
          {emailCheck && <Alert severity="info">{emailCheck}</Alert>}
          <TextField type="number"
            label="Contact Number"
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
            name="contactNumber"
            value={formData.contactNumber || ''}
            onChange={handleInputChange}
            onBlur={handleNumberChange}
            helperText={phoneNumberError}
          />
          {numberCheck && <Alert severity="info">{numberCheck}</Alert>}
        </Form>
        <Button variant="contained" disabled={isDisabled} onClick={onNext}>Next</Button>
      </Typography>
    </Container>
  )
}
