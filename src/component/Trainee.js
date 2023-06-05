
import { TextField, Button, Alert, Typography, Container } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export const Trainee = ({ formData, setFormData, onNext }) => {
  const [error, setError] = useState();
  const [emailCheck,setEmailCheck]=useState();
  const [numberCheck,setNumberCheck] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmail=(e)=>{
    console.log("Email check")
     axios.get(`http://localhost:8080/api/emailCheck?email=${formData.email}`,{
      headers:{
        'spreadsheetId':'1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
      }
    }).then(response=>{
      setEmailCheck(response.data);
    });
    console.log(formData.email)
  }

  const handleNumberChange=(e)=>{
    console.log("number check")
    axios.get(`http://localhost:8080/api/contactNumberCheck?contactNumber=${formData.contactNumber}`,{
      headers:{
        'spreadsheetId':'1p3G4et36vkzSDs3W63cj6qnUFEWljLos2HHXIZd78Gg'
      }
    }).then(response=>{
      setNumberCheck(response.data);
    });;
    console.log(formData.contactNumber)
  }

  const isDisabled = !formData.traineeName || !formData.email || !formData.contactNumber||!emailCheck||!numberCheck;
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
            onKeyUp={handleEmail}
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
            onKeyUp={handleNumberChange}
          />
          {numberCheck && <Alert severity="info">{numberCheck}</Alert>}
        </Form>
        <Button variant="contained" disabled={isDisabled} onClick={onNext}>Next</Button>
      </Typography>
    </Container>
  )
}
