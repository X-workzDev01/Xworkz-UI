import { TextField,Button } from '@mui/material';
import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const Course = ({ formData, setFormData, onNext,onPrevious }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Container>
    <h2>Course</h2>
    <Form>
    <TextField type="text"
       placeholder="Course Name"
       required
       name="coursename"
        value={formData.coursename || ''}
         onChange={handleInputChange} />
      <TextField type="text"
       placeholder="Branch"
       required
       name="branch"
        value={formData.branch || ''}
         onChange={handleInputChange} />
      <TextField type="text"
       placeholder="Batch"
       required
       name="batch"
        value={formData.batch || ''}
         onChange={handleInputChange} />
      </Form>
      <Button variant="contained" onClick={onPrevious}>Previous</Button>
      &nbsp;&nbsp;&nbsp;
      <Button variant="contained" onClick={onNext}>Next</Button>
     
      </Container>
  )
}
