import React from 'react'
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';


export const EducationDetails = ({ formData, setFormData, onNext,onPrevious }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

  return (
    <Container>
    <h2>Education Details</h2>
    <Form>
    <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="Qualification"
       required
       name="qualification"
        value={formData.qualification || ''}
         onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="stream"
       required
       name="stream"
        value={formData.stream || ''}
         onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="number"
       placeholder="Year of Passout"
       required
       name="yop"
        value={formData.yop || ''}
         onChange={handleInputChange} />
      </Form.Group>
      <Form.Group className="mb-6" controlId="formBasicEmail">
      <Form.Control type="text"
       placeholder="College Name"
       required
       name="collegename"
        value={formData.collegename || ''}
         onChange={handleInputChange} />
      </Form.Group>
      </Form>
      <button onClick={onPrevious}>Previous</button>
      <button onClick={onNext}>Next</button>
     
      </Container>
  )
}
