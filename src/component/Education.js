import { Button, Select, MenuItem, Container, Typography, InputLabel } from '@mui/material';
import { Form } from 'react-bootstrap';

export const Education = ({ dropdown, formData, setFormData, onNext, onPrevious }) => {
   const yearOfPass = ['2010', '2011', '2012', '2013', '2014', '2015', '2016',
      '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025']

   const sortedQualifications = dropdown.qualification.slice().sort((a, b) => a.localeCompare(b));
   const sortedStream = dropdown.stream.slice().sort((a, b) => a.localeCompare(b));
   const sortedColleges = dropdown.college.slice().sort((a, b) => a.localeCompare(b));

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };


   const isDisabled = !formData.qualification || !formData.stream || !formData.yearOfPassout || !formData.collegeName;
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
                  variant="outlined"
               >
                  {
                     sortedQualifications.map((item, index) => (
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
                  id="outlined-basic"
                  variant="outlined"
               >
                  {sortedStream.map((item, index) => (
                     <MenuItem value={item} key={index}>{item}</MenuItem>
                  ))}
               </Select>
               <InputLabel id="demo-simple-select-label">Year of Pass</InputLabel>
               <Select name="yearOfPassout"
                  value={formData.yearOfPassout || ''}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  id="outlined-basic"
                  variant="outlined"
               >
                  {yearOfPass.map((item, index) => (
                     <MenuItem value={item} key={index}>{item}</MenuItem>
                  ))}
               </Select>
               <InputLabel id="demo-simple-select-label">College</InputLabel>
               <Select name="collegeName"
                  value={formData.collegeName || ''}
                  onChange={handleInputChange}
                  placeholder="College Name"
                  fullWidth
                  required
                  id="outlined-basic"
                  variant="outlined"
               >
                  {sortedColleges.map((item, index) => (
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
