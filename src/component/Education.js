import{ Button, Select, MenuItem, TextField, Container, Typography, InputLabel } from '@mui/material';
import React from 'react'
import { Form } from 'react-bootstrap';


export const Education = ({ formData, setFormData, onNext, onPrevious }) => {
   const degree = ['BE', 'BSC', 'BCA', 'MCA']
   const division = ['ISE', 'CSE', 'ECE', 'EEE']
   const cname = ['SKSIT', 'AIT', 'BKIT', 'SIT', "JNNC"]
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };
   const isDisabled=!formData.qualification||!formData.stream||!formData.yearOfPassout||!formData.collegeName;
   return (
      <Container maxWidth="sm">
         <Typography component="div" style={{ height: '50vh' }}>
            <h2>Education Details</h2>
            <Form>
            <InputLabel id="demo-simple-select-label">Qualification</InputLabel>
               <Select name="qualification"
                  value={formData.qualification || ''}
                  onChange={handleInputChange}
                  placeholder="Qualification"
                  required
                  fullWidth
                  margin="normal"
                  variant="outlined"
               >
                  {degree.map((item, index) => (
                     <MenuItem value={item} key={index}>{item}</MenuItem>
                  ))}
               </Select>

               <InputLabel id="demo-simple-select-label">Stream</InputLabel>
               <Select name="stream"
                  value={formData.stream || ''}
                  onChange={handleInputChange}
                  placeholder="Stream"
                  required
                  fullWidth
                  margin="normal"
                  id="outlined-basic"
                  variant="outlined"
               >
                  {division.map((item, index) => (
                     <MenuItem value={item} key={index}>{item}</MenuItem>
                  ))}
               </Select>

               <TextField type="date"
                  name="yearOfPassout"
                  value={formData.yearOfPassout || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  required
                  id="outlined-basic"
                  variant="outlined"
               />
               <InputLabel id="demo-simple-select-label">College</InputLabel>
               <Select name="collegeName"
                  value={formData.collegeName || ''}
                  onChange={handleInputChange}
                  placeholder="College Name"
                  fullWidth
                  margin="normal"
                  required
                  id="outlined-basic"
                  variant="outlined"
               >
                  {cname.map((item, index) => (
                     <MenuItem value={item} key={index}>{item}</MenuItem>
                  ))}
               </Select>              
            </Form>
            <Button variant="contained" onClick={onPrevious}>Previous</Button>
               &nbsp;&nbsp;&nbsp;
               <Button variant="contained" disabled={isDisabled} onClick={onNext}>Next</Button>
         </Typography>
      </Container>
   )
}
