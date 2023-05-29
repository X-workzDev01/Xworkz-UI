import { Button, InputLabel, TextField } from '@mui/material';
import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const Referral = ({ formData, setFormData, onNext, onPrevious }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container>
      <h2>Referral Details </h2>
      <Form>
        <InputLabel>Discription</InputLabel>
        <TextField type="text"
          placeholder="Discription"
          required
          name="discription"
          value={formData.discription || ''}
          onChange={handleInputChange}
          InputProps={{
            style: { paddingRight: '1rem' },
          }} />
        <InputLabel>Name</InputLabel>
        <TextField type="text"
          placeholder="Name "
          required
          name="refname"
          value={formData.refname || ''}
          onChange={handleInputChange}
          InputProps={{
            style: { paddingRight: '1rem' },
          }} />
        <InputLabel>Contact Number</InputLabel>

        <TextField type="number"
          placeholder="Contact Number"
          required
          name="refnumber"
          value={formData.refnumber || ''}
          onChange={handleInputChange}
          InputProps={{
            style: { paddingRight: '1rem' },
          }}
        />

      </Form>
      <Button variant="contained" onClick={onPrevious}>Previous</Button>
      &nbsp;&nbsp;&nbsp;
      <Button variant="contained" onClick={onNext}>Register</Button>
    </Container>
  )
}
