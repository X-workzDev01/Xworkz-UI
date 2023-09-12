import { Button, Container, TextField, Typography, CircularProgress } from '@mui/material';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

export const Referral = ({ formData, setFormData, onNext, onPrevious }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = () => {
    setIsLoading(true); // Set loading state to true

    // Simulate an API call or any other time-consuming operation
    setTimeout(() => {
      setIsLoading(false); // Set loading state back to false
      onNext(); // Continue to the next step
    }, 6000); // Simulating a 3-second delay, replace with your actual API call
  };

  return (
    <Container maxWidth="sm">
      <h2>Referral Details </h2>
      <Typography component="div" style={{ height: '50vh' }}>
        <Form>
          <TextField
            type="text"
            label="Name"
            name="referalName"
            value={formData.referalName || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />

          <TextField
            type="number"
            label="Contact Number"
            name="referalContactNumber"
            value={formData.referalContactNumber || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />

          <TextField
            type="text"
            label="comments"
            name="comments"
            value={formData.comments || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />
        </Form>
        {isLoading ? (
          <CircularProgress size={24} style={{ marginTop: '20px' }} />
        ) : (
          <>
            <Button variant="contained" onClick={onPrevious}>
              Previous
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button variant="contained" onClick={handleRegister}>
              Register
            </Button>
          </>
        )}
      </Typography>
    </Container>
  );
};
