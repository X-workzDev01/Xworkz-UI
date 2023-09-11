import { Button, MenuItem, Select, TextField, Container, Typography, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { Form } from 'react-bootstrap';
import axios from 'axios';
import { Urlconstant } from '../constant/Urlconstant';
import styled from '@emotion/styled';
const PrimaryMenuItem = styled(MenuItem)({
  color: 'Black', // Set your desired primary color here
});
export const Course = ({ dropdown, formData, setFormData, onNext, onPrevious }) => {
 const [selectedValue, setSelectedValue] = useState('Java');
  const [value ,setValue ]=useState('');
  const [loading ,setLoading]=useState(false)

  useEffect(()=>{
    if (selectedValue) {
      fetchData();
    }
  }, [selectedValue]);
   const fetchData = async () => {
    try {

      setLoading(true);
      console.log("coursede"+selectedValue)
      axios.get(Urlconstant.url + `api/getCourseDetails?courseName=${selectedValue}`, {headers: 
       { 'spreadsheetId': Urlconstant.spreadsheetId}
      }).then((res) =>(

 setValue(res.data)));

        
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

 
  

  
  const handleInputChange = (e) => {  
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setSelectedValue(e.target.value);  
  };

  const setSelect =(e)=>
  {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  
  const isDisabled = !formData.course  || !formData.offeredAs;

  return (
    <Container maxWidth="sm">
      <h2>Course Details</h2>
      <Typography component="div" style={{ height: '50vh' }}>
        <InputLabel id="demo-simple-select-label">Course</InputLabel>
        {loading ? <p>Wait Loading...........</p>:''}
        <Form>
          <Select name="course"
            value={selectedValue}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
            onChange={handleInputChange}
         >
            {dropdown.course.map((item, index) => (


              <PrimaryMenuItem  value={item}  key={index}>{item}</PrimaryMenuItem>

            ))} 
          </Select>

          <InputLabel id="demo-simple-select-label">Branch</InputLabel>
          <TextField           
            name="branch"
            value={value.branch}
            required
            aria-readonly
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          >
            
          </TextField>
          <InputLabel id="demo-simple-select-label">Trainer Name</InputLabel>
          <TextField           
            name="trainerName"
            value={value.trainerName}
            required
            
            aria-readonly
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          >
           
          </TextField>
          <InputLabel id="demo-simple-select-label">Batch Type </InputLabel>


          <TextField           
            name="batchType"
            value={value.batchType}
            required
            aria-readonly
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          >
           
          </TextField>
          <InputLabel id="demo-simple-select-label">Batch Timing </InputLabel>

          <TextField           
            name="batchTiming "
            value={value.timing}
            required
            aria-readonly
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          >
           
          </TextField>
          <InputLabel id="demo-simple-select-label">StartTime Timing </InputLabel>

          <TextField 
            name="startTime"
            aria-readonly

            value={value.startTime}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          />
          <InputLabel id="demo-simple-select-label">Offered As</InputLabel>
          <Select name="offeredAs"
            value={formData.offeredAs || ''}
            onChange={setSelect}
            required
            fullWidth
            margin="normal"
            id="outlined-basic"
            variant="outlined"
          >
            {dropdown.offered.map((item, index) => (
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
