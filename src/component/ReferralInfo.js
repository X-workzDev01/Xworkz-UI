import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';

export const ReferralInfo  = ({ formData, setFormData, onNext ,onPrevious}) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Container>
    <h2>Referral Information </h2>
    <Form>
    <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="Discription"
       required
       name="discription"
        value={formData.discription || ''}
         onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="Name "
       required
       name="refName"
        value={formData.refName || ''}
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
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Rgister</button>
     
      </Container>
  )
}
