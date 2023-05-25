import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const TraineeInfo = ({ formData, setFormData, onNext }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Container>
    <h2>TraineeInfo</h2>
    <Form>
    <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="User Name"
       required
       name="username"
        value={formData.username || ''}
         onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="email"
       placeholder="E-mail"
       required
       name="email"
        value={formData.email || ''}
         onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="tel"
       placeholder="Contact Number"
       required
       name="contactnumber"
        value={formData.contactnumber || ''}
         onChange={handleInputChange} />
      </Form.Group>
      </Form>

      <button onClick={onNext}>Next</button>
     
      </Container>
  )
}
