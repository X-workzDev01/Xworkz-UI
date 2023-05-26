import { InputLabel,Button, MenuItem, Select, TextField } from '@mui/material';
import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const Course = ({ formData, setFormData, onNext, onPrevious }) => {
  const courseName=['JAVA','Web Technology','SQL','JPA','FrameWork']
  const branchName=['Rajajinagar','BTM']
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container>
      <h2>Course</h2>
      <Form>
      <InputLabel>Course</InputLabel>
        <Select name="course"
        sx={{
          width: '200px',
          height: '40px', 
        }}
          value={formData.course || ''}
          onChange={handleInputChange}
        >
          {courseName.map((item, index) => (
           <MenuItem value={item} key={index}>{item}</MenuItem>
        ))}
        </Select>
        <InputLabel>Branch</InputLabel>
        <Select name="branch"
          value={formData.branch || ''}
          onChange={handleInputChange}
          sx={{
            width: '200px',
            height: '40px', 
          }}
        >
           {branchName.map((item, index) => (
           <MenuItem value={item} key={index}>{item}</MenuItem>
        ))}
        </Select>

        <InputLabel>Batch</InputLabel>

        <TextField  type="date"
            name="batch"
            value={formData.batch || ''}
               onChange={handleInputChange}
            />
      </Form>
      <Button variant="contained" onClick={onPrevious}>Previous</Button>
      &nbsp;&nbsp;&nbsp;
      <Button variant="contained" onClick={onNext}>Next</Button>
    </Container>
  )
}
