import { Button,TextField } from '@mui/material';
import React from 'react'
import {  Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const Referral  = ({ formData, setFormData, onNext ,onPrevious}) => {
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
       name="refname"
        value={formData.refname || ''}
         onChange={handleInputChange} />
      <TextField type="number"
       placeholder="Contact Number"
       required
       name="refnumber"
        value={formData.refnumber || ''}
         onChange={handleInputChange} />
      </Form>
      <Button  variant="contained" onClick={onPrevious}>Previous</Button>
      &nbsp;&nbsp;&nbsp;
      <Button  variant="contained" onClick={onNext}>Rgister</Button>

      </Container>
  )
}
