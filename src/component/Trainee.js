import { TextField, Button, Alert, Typography, Container } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Urlconstant } from '../constant/Urlconstant';

export const Trainee = ({ formData, setFormData, onNext }) => {
  const [error, setError] = useState();
  const [emailCheck, setEmailCheck] = useState(null);
  const [numberCheck, setNumberCheck] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [buttonEnabled , setButtonEnabled] = useState(false);
  const [phoneNumberError, setPhoneNumberError] = useState('');


  const handleInputChange = (e) => {
  const { name, value } = e.target;

  if (name === 'traineeName') {
    // Perform name validation
    if (!value) {
      setNameError('Name is required');
    } 
    else if(value.length<3){
      console.log("name length is less")
      setNameError('Enter a Valid Name');
    }
    else {
      setNameError('');
    }
  } else if (name === 'email') {
    // Perform email validation
    if (!value) {
      setEmailError('Email is required');
      
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');
    }
    handleEmail();
  } else if (name === 'contactNumber') {
    // Perform contact number validation
    if (!value) {
      setPhoneNumberError('Phone number is required');
    } else if (!/^\d+$/.test(value)) {
      setPhoneNumberError('Phone number must contain only digits');

    } else if (value.length !==10) {
      setPhoneNumberError('Phone number must contain exactly 10 digits');
      
    } else {
      setPhoneNumberError('');
    }
    handleNumberChange();
  }
  setFormData({ ...formData, [name]: value });
}

  
  

 


  const handleEmail = (e) => {
    validateEmail(formData.email);
    axios.get(Urlconstant.url + `api/emailCheck?email=${formData.email}`, {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      if (response.status === 201) {
        // Handle the 201 response differently, only setting emailCheck
        setEmailCheck(response.data);
      }
      else{
        setEmailCheck(null);
      }
      
    }).catch();
    //setError("Check Email Id")
    console.log(error)
  }

 
  const handleNumberChange = (e) => {
    console.log("number check");

    // Check if the contactNumber is blank (empty string)
    if (!formData.contactNumber) {
      console.log("Contact number is blank. Cannot make the API call.");
      return; // This will prevent the API call from being made.
    }

    // If the contactNumber is not blank, proceed with making the API call.
    // validatePhoneNumber(formData.contactNumber);

    axios.get(Urlconstant.url + `api/contactNumberCheck?contactNumber=${formData.contactNumber}`, {
      headers: {
        'spreadsheetId': Urlconstant.spreadsheetId
      }
    }).then(response => {
      if (response.status === 201) {
        // Handle the 201 response differently, only setting numberCheck
        setNumberCheck(response.data);
      }
      else{
        setNumberCheck(null);
      }
    }).catch(error => {
      console.log(error);
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

  // const validatePhoneNumber = (value) => {
  //   if (!value) {
  //     setPhoneNumberError('Phone number is required');
  //   } else if (!/^\d+$/.test(value)) {
  //     setPhoneNumberError('Phone number must contain only digits');
  //   } else if (value.length < 10) {
  //     setPhoneNumberError('Phone number must be at least 10 digits');
  //   } else {
  //     setPhoneNumberError('');
  //   }
  // };

  const isDisabled= !formData.traineeName || !formData.email || !formData.contactNumber;
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
           {nameError && <Alert severity="error">{nameError}</Alert>}
          
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
            
          />
            {emailError && <Alert severity="error">{emailError}</Alert>}
           {emailCheck && <Alert severity="error">{emailCheck}</Alert>}
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
           
          />
          {phoneNumberError && <Alert severity="error">{phoneNumberError}</Alert>}
          {numberCheck && <Alert severity="error">{numberCheck}</Alert>}
          <TextField type="date"
            name="dob"
            value={formData.dob || ''}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />
        </Form>
        <Button variant="contained" disabled={isDisabled} onClick={onNext}>Next</Button>
      </Typography>
    </Container>
  )
}
