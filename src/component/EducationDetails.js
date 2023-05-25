import { TextField,Button } from '@mui/material';
import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';


export const EducationDetails = ({ formData, setFormData, onNext,onPrevious }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Container>
    <h2>Education Details</h2>
    <Form>
    <TextField type="text"
       placeholder="Qualification"
       required
       name="qualification"
        value={formData.qualification || ''}
         onChange={handleInputChange} />
      <TextField type="text"
       placeholder="stream"
       required
       name="stream"
        value={formData.stream || ''}
         onChange={handleInputChange} />
      <TextField type="number"
       placeholder="Year of Passout"
       required
       name="yop"
        value={formData.yop || ''}
         onChange={handleInputChange} />
      <TextField type="text"
       placeholder="College Name"
       required
       name="collegename"
        value={formData.collegename || ''}
         onChange={handleInputChange} />
      </Form>
      <Button  variant="contained" onClick={onPrevious}>Previous</Button>
      &nbsp;&nbsp;&nbsp;
      <Button  variant="contained" onClick={onNext}>Next</Button>
     
      </Container>
  )
}
