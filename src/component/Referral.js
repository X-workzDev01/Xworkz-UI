import { Button, Container, TextField, Typography } from '@mui/material';
import React from 'react'
import { Form } from 'react-bootstrap';

export const Referral = ({ formData, setFormData, onNext, onPrevious }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container maxWidth="sm">
      <h2>Referral Details </h2>
      <Typography component="div" style={{ height: '50vh' }}>
        <Form>
          <TextField type="text"
            label="Discription"
            name="discription"
            value={formData.discription || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />

          <TextField type="text"
            label="Name "
            name="refname"
            value={formData.refname || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />

          <TextField type="number"
            label="Contact Number"
            name="refnumber"
            value={formData.refnumber || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />

        </Form>
        <Button variant="contained" onClick={onPrevious}>Previous</Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" onClick={onNext}>Register</Button>
      </Typography>
    </Container>
  )
}
