import { Button, MenuItem, Select, TextField, Container, Typography, InputLabel } from '@mui/material';
import React from 'react'
import { Form } from 'react-bootstrap';

export const Course = ({ formData, setFormData, onNext, onPrevious }) => {
  const courseName = ['JAVA', 'Web Technology', 'SQL', 'JPA', 'FrameWork']
  const branchName = ['Rajajinagar', 'BTM']


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const isDisabled=!formData.course||!formData.branch||!formData.batch;

  return (
    <Container maxWidth="sm">
      <h2>Course Details</h2>
      <Typography component="div" style={{ height: '50vh' }}>
      <InputLabel id="demo-simple-select-label">Course</InputLabel>
        <Form>
          <Select name="course"
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
            value={formData.course || ''}
            onChange={handleInputChange}
          >
            {courseName.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}
          </Select>

          <InputLabel id="demo-simple-select-label">Branch</InputLabel>
          <Select name="branch"
            value={formData.branch || ''}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          >
            {branchName.map((item, index) => (
              <MenuItem value={item} key={index}>{item}</MenuItem>
            ))}
          </Select>

          <TextField type="date"
            name="batch"
            value={formData.batch || ''}
            onChange={handleInputChange}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />
        </Form>
        <Button variant="contained" onClick={onPrevious}>Previous</Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" disabled={isDisabled} onClick={onNext}>Next</Button>
      </Typography>
    </Container>
  )
}
