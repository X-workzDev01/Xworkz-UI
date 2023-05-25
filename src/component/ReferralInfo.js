import { Button,TextField } from '@mui/material';
import React from 'react'
import {  Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const ReferralInfo  = ({ formData, setFormData, onNext ,onPrevious}) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Container>
    <h2>Referral Information </h2>
    <Form>
    <TextField type="text"
       placeholder="Discription"
       required
       name="discription"
        value={formData.discription || ''}
         onChange={handleInputChange} />
      <TextField type="text"
       placeholder="Name "
       required
       name="refName"
        value={formData.refName || ''}
         onChange={handleInputChange} />
      <TextField type="tel"
       placeholder="Contact Number"
       required
       name="contactnumber"
        value={formData.contactnumber || ''}
         onChange={handleInputChange} />
      </Form>
      <Button  variant="contained" onClick={onPrevious}>Previous</Button>
      &nbsp;&nbsp;&nbsp;
      <Button  variant="contained" onClick={onNext}>Rgister</Button>
      
     
      </Container>
  )
}
