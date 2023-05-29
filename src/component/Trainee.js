
import { TextField ,Button, InputLabel, Alert} from '@mui/material';
import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const Trainee = ({ formData, setFormData, onNext }) => {
  const [error,setError]=useState();  
  
  const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const handleStep1Next = () => {
        if(!formData.name||!formData.email||!formData.contactnumber){
          setError("Please fill all the required fields");
        
        }
        
    }
  return (
    <Container>
    <h2>Trainee</h2>
    <Form>
    {error && <Alert severity="error">{error}</Alert>}
    <InputLabel>Trainee Name</InputLabel>
      <TextField type="text"
       placeholder="User Name"
      
       name="username"
        value={formData.username || ''}
         onChange={handleInputChange}
         InputProps={{
          style: { paddingRight: '1rem' },
        }} 
        required
        />
  
  <InputLabel>E-mail</InputLabel>
      <TextField type="email"
       placeholder="E-mail"
       required
       name="email"
        value={formData.email || ''}
         onChange={handleInputChange}
         InputProps={{
          style: { paddingRight: '1rem' },
        }} />
      <InputLabel>Contact Number</InputLabel>
      <TextField type="number"
       placeholder="Contact Number"
       required
       name="contactnumber"
        value={formData.contactnumber || ''}
         onChange={handleInputChange} 
         InputProps={{
          style: { paddingRight: '1rem' },
        }}/>
      </Form>
      <Button variant="contained"  onClick={handleStep1Next}>Next</Button>   
      </Container>
  )
}
