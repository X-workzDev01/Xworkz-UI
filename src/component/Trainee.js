import { TextField ,Button} from '@mui/material';
import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const Trainee = ({ formData, setFormData, onNext }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Container>
    <h2>Trainee</h2>
    <Form>
      <TextField type="text"
       placeholder="User Name"
       required
       name="username"
        value={formData.username || ''}
         onChange={handleInputChange} />
  
      <TextField type="email"
       placeholder="E-mail"
       required
       name="email"
        value={formData.email || ''}
         onChange={handleInputChange} />
      
      <TextField type="number"
       placeholder="Contact Number"
       required
       name="contactnumber"
        value={formData.contactnumber || ''}
         onChange={handleInputChange} />
         
      </Form>
      <Button variant="contained"  onClick={onNext}>Next</Button>   
      </Container>
  )
}
