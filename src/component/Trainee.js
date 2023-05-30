
import { TextField, Button, Alert, Typography, Container } from '@mui/material';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export const Trainee = ({ formData, setFormData, onNext }) => {
  const [error, setError] = useState();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isDisabled = !formData.username || !formData.email || !formData.contactnumber;
  return (
    <Container maxWidth="sm">
      <Typography component="div" style={{ height: '50vh' }}>
        <h2>Trainee</h2>
        <Form>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField type="text"
            label="User Name"
            name="username"
            value={formData.username || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
            id="outlined-basic"
            variant="outlined"
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

          />
          <TextField type="number"
            label="Contact Number"
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
            name="contactnumber"
            value={formData.contactnumber || ''}
            onChange={handleInputChange}
          />
        </Form>
        <Button variant="contained" disabled={isDisabled} onClick={onNext}>Next</Button>

      </Typography>
    </Container>
  )
}
