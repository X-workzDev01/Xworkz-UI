import { Button, Container, TextField, Typography, CircularProgress, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import React from 'react';
import { Form } from 'react-bootstrap';

export const Referral = ({ formData, setFormData, onNext, onPrevious, loading}) => {
 


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
           <FormControl component="fieldset" style={{ marginTop: '20px' }}>
            <FormLabel component="legend">Working</FormLabel>
            <RadioGroup
              aria-label="working"
              name="working"
              value={formData.working || 'No'}
              onChange={handleInputChange}
              row
            >
              <FormControlLabel value={"Yes"} control={<Radio />} label="Yes" />
              <FormControlLabel value={"No"} control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Form>
        {loading ? (
          <CircularProgress size={24} style={{ marginTop: '20px' }} />
        ) : (
          <>
            <Button variant="contained" onClick={onPrevious}>
              Previous
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button variant="contained" onClick={onNext}>
              Register
            </Button>

          </>
      
       )}
      </Typography>
    </Container>
  );
};
