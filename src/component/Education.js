import {InputLabel, Button, Select, MenuItem, TextField } from '@mui/material';
import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';


export const Education = ({ formData, setFormData, onNext, onPrevious }) => {
   const degree=['BE','BSC','BCA','MCA']
   const division=['ISE','CSE','ECE','EEE']
   const cname=['SKSIT','AIT','BKIT','SIT',"JNNC"]
   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   return (
      <Container>
         <h2>Education Details</h2>
         <Form>
         <InputLabel>Qualification</InputLabel>
            <Select name="qualification"
               value={formData.qualification || ''}
               onChange={handleInputChange}
               placeholder="Qualification"
               sx={{
                  width: '200px',
                  height: '40px', 
                }}
            >
              {degree.map((item, index) => (
           <MenuItem value={item} key={index}>{item}</MenuItem>
        ))}
            </Select>
            <InputLabel>Stream</InputLabel>
            <Select name="stream"
               value={formData.stream || ''}
               onChange={handleInputChange}
               sx={{
                  width: '200px',
                  height: '40px', 
                }}
            >
               {division.map((item, index) => (
           <MenuItem value={item} key={index}>{item}</MenuItem>
        ))}
            </Select>
            <InputLabel>Year Of Pass</InputLabel>
            <TextField  type="date"
            name="yearofpass"
            value={formData.yearofpass || ''}
               onChange={handleInputChange}
            />

            <InputLabel>College Name</InputLabel>
            <Select name="collegename"
               value={formData.collegename || ''}
               onChange={handleInputChange}
               placeholder="Qualification"
               sx={{
                  width: '200px',
                  height: '40px', 
                }}
            >
                {cname.map((item, index) => (
           <MenuItem value={item} key={index}>{item}</MenuItem>
        ))}
            </Select>
         </Form>
         <Button variant="contained" onClick={onPrevious}>Previous</Button>
         &nbsp;&nbsp;&nbsp;
         <Button variant="contained" onClick={onNext}>Next</Button>
      </Container>
   )
}
